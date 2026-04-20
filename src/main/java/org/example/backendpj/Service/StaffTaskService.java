package org.example.backendpj.Service;

import org.example.backendpj.Entity.Room;
import org.example.backendpj.Entity.Staff;
import org.example.backendpj.Entity.StaffTask;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.RoomRepository;
import org.example.backendpj.Repository.StaffRepository;
import org.example.backendpj.Repository.StaffTaskRepository;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.dto.StaffTaskForm;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Stream;

@Service
public class StaffTaskService {

    private static final Set<String> MANAGER_ROLES = Set.of("ADMIN", "MANAGER");
    private static final Set<String> ASSIGNABLE_ROLES = Set.of("MANAGER", "RECEPTIONIST", "HOUSEKEEPER");
    private static final Set<String> VALID_STATUSES = Set.of("PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED");
    private static final Set<String> VALID_PRIORITIES = Set.of("LOW", "MEDIUM", "HIGH", "URGENT");
    private static final Set<String> VALID_TYPES = Set.of("HOUSEKEEPING", "EQUIPMENT_CHECK", "CUSTOMER_SUPPORT", "MAINTENANCE");
    private static final Set<String> HOUSEKEEPING_ROOM_STATUSES = Set.of("CHECKED-OUT", "HOUSEKEEPING");

    private final StaffTaskRepository staffTaskRepository;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public StaffTaskService(StaffTaskRepository staffTaskRepository,
                            StaffRepository staffRepository,
                            UserRepository userRepository,
                            RoomRepository roomRepository) {
        this.staffTaskRepository = staffTaskRepository;
        this.staffRepository = staffRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    public List<StaffTask> getAllTasks(String status, String type, Integer assignedUserId) {
        Stream<StaffTask> stream = staffTaskRepository.findAllByOrderByCreatedAtDesc().stream();

        String normalizedStatus = normalize(status);
        if (!normalizedStatus.isBlank()) {
            stream = stream.filter(task -> normalizedStatus.equals(normalize(task.getStatus())));
        }

        String normalizedType = normalize(type);
        if (!normalizedType.isBlank()) {
            stream = stream.filter(task -> normalizedType.equals(normalize(task.getTaskType())));
        }

        if (assignedUserId != null) {
            stream = stream.filter(task -> task.getAssignedStaff() != null
                    && task.getAssignedStaff().getUser() != null
                    && assignedUserId.equals(task.getAssignedStaff().getUser().getId()));
        }

        return stream.sorted(managePageComparator()).toList();
    }

    public List<StaffTask> getTasksForUser(String login) {
        User user = requireUser(login);
        return staffTaskRepository.findAllByAssignedStaff_User_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .sorted(myTaskComparator())
                .toList();
    }

    public List<User> getAssignableUsers() {
        return userRepository.findAll().stream()
                .filter(User::isEnabled)
                .filter(user -> ASSIGNABLE_ROLES.contains(normalize(user.getRole())))
                .sorted(Comparator.comparing(User::getFullName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    public List<Room> getRooms() {
        return roomRepository.findAll(Sort.by("roomNumber").ascending());
    }

    public StaffTask createTask(StaffTaskForm form, String creatorLogin) {
        if (form == null) {
            throw new IllegalArgumentException("Task data is required.");
        }
        if (form.getTitle() == null || form.getTitle().isBlank()) {
            throw new IllegalArgumentException("Task title is required.");
        }

        String taskType = normalize(form.getTaskType());
        if (!VALID_TYPES.contains(taskType)) {
            throw new IllegalArgumentException("Invalid task type.");
        }

        String priority = normalize(form.getPriority());
        if (!VALID_PRIORITIES.contains(priority)) {
            priority = "MEDIUM";
        }

        User creator = requireUser(creatorLogin);
        Staff assignedStaff = staffRepository.findByUserId(form.getAssignedUserId())
                .orElseThrow(() -> new IllegalArgumentException("Assigned staff was not found."));
        Room room = form.getRoomId() == null
                ? null
                : roomRepository.findById(form.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Selected room was not found."));

        if ("HOUSEKEEPING".equals(taskType) && room != null && !isHousekeepingEligibleRoom(room)) {
            throw new IllegalArgumentException("Housekeeping tasks can only be assigned to checked-out or housekeeping rooms.");
        }

        StaffTask task = new StaffTask();
        task.setTitle(form.getTitle().trim());
        task.setTaskType(taskType);
        task.setDescription(trimToNull(form.getDescription()));
        task.setPriority(priority);
        task.setStatus("PENDING");
        task.setDueAt(form.getDueAt());
        task.setAssignedStaff(assignedStaff);
        task.setCreatedBy(creator);
        task.setRoom(room);
        return staffTaskRepository.save(task);
    }

    public StaffTask updateTaskStatus(Integer taskId, String newStatus, String note, String actorLogin) {
        StaffTask task = staffTaskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task was not found."));

        User actor = requireUser(actorLogin);
        boolean isManager = isManager(actor);
        boolean isAssignedUser = task.getAssignedStaff() != null
                && task.getAssignedStaff().getUser() != null
                && task.getAssignedStaff().getUser().getId().equals(actor.getId());

        if (!isManager && !isAssignedUser) {
            throw new IllegalArgumentException("You are not allowed to update this task.");
        }

        String normalizedStatus = normalize(newStatus);
        if (!VALID_STATUSES.contains(normalizedStatus)) {
            throw new IllegalArgumentException("Invalid task status.");
        }
        if (!isManager && "CANCELLED".equals(normalizedStatus)) {
            throw new IllegalArgumentException("Only manager or admin can cancel a task.");
        }

        task.setStatus(normalizedStatus);
        task.setResolutionNote(trimToNull(note));
        if ("COMPLETED".equals(normalizedStatus)) {
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setCompletedAt(null);
        }

        return staffTaskRepository.save(task);
    }

    public TaskSummary summarize(List<StaffTask> tasks) {
        LocalDateTime now = LocalDateTime.now();
        long total = tasks.size();
        long pending = tasks.stream().filter(task -> "PENDING".equals(normalize(task.getStatus()))).count();
        long inProgress = tasks.stream().filter(task -> "IN_PROGRESS".equals(normalize(task.getStatus()))).count();
        long completed = tasks.stream().filter(task -> "COMPLETED".equals(normalize(task.getStatus()))).count();
        long overdue = tasks.stream()
                .filter(task -> !"COMPLETED".equals(normalize(task.getStatus())))
                .filter(task -> !"CANCELLED".equals(normalize(task.getStatus())))
                .filter(task -> task.getDueAt() != null && task.getDueAt().isBefore(now))
                .count();

        return new TaskSummary(total, pending, inProgress, completed, overdue);
    }

    private User requireUser(String login) {
        return userRepository.findByUsernameOrEmail(login, login)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    private boolean isManager(User user) {
        return user != null && MANAGER_ROLES.contains(normalize(user.getRole()));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private Comparator<StaffTask> managePageComparator() {
        return Comparator
                .comparing(this::statusWeight)
                .thenComparing(StaffTask::getDueAt, Comparator.nullsLast(Comparator.naturalOrder()))
                .thenComparing(StaffTask::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()));
    }

    private Comparator<StaffTask> myTaskComparator() {
        return Comparator
                .comparing(this::statusWeight)
                .thenComparing(StaffTask::getDueAt, Comparator.nullsLast(Comparator.naturalOrder()))
                .thenComparing(StaffTask::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()));
    }

    private int statusWeight(StaffTask task) {
        return switch (normalize(task.getStatus())) {
            case "IN_PROGRESS" -> 0;
            case "PENDING" -> 1;
            case "COMPLETED" -> 2;
            case "CANCELLED" -> 3;
            default -> 4;
        };
    }

    public boolean isHousekeepingEligibleRoom(Room room) {
        return room != null && HOUSEKEEPING_ROOM_STATUSES.contains(normalize(room.getStatus()));
    }

    public record TaskSummary(long total, long pending, long inProgress, long completed, long overdue) {
    }
}
