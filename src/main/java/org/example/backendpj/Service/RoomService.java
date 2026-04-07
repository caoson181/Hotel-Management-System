package org.example.backendpj.Service;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.BookingDetail;
import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.CustomerBooking;
import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.BookingDetailRepository;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.Repository.CustomerBookingRepository;
import org.example.backendpj.Repository.CustomerRepository;
import org.example.backendpj.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerBookingRepository customerBookingRepository;

    @Autowired
    private DailyRevenueService dailyRevenueService;

    @Autowired
    private CustomerTierService customerTierService;

    public Page<Room> search(String keyword, int page, String sortField, String sortDir) {
        int pageSize = 20;
        sortField = sortField.trim();
        sortDir = sortDir.trim();
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        if (keyword != null && !keyword.trim().isEmpty()) {
            return roomRepository.search(keyword, pageable);
        }

        return roomRepository.findAll(pageable);
    }

    public Room updateStatus(Integer id, String newStatus) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        String normalizedStatus = newStatus == null ? "" : newStatus.trim().toUpperCase();
        validateStatusChange(room, normalizedStatus);

        room.setStatus(normalizedStatus);
        room = roomRepository.save(room);
        if ("CHECKED-OUT".equals(normalizedStatus)) {
            applyActualCheckoutDate(room, LocalDate.now());
        }

        syncBookingsForRoom(room);
        return room;
    }

    public void markNoShowForToday(Integer roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        LocalDate today = LocalDate.now();
        List<BookingDetail> checkoutDetails = bookingDetailRepository.findCheckOutDetailsByDate(room, today);
        BookingDetail targetDetail = checkoutDetails.stream()
                .filter(this::canMarkNoShow)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No no-show candidate found for today"));

        targetDetail.setStatus("NO_SHOW");
        bookingDetailRepository.save(targetDetail);

        Booking booking = targetDetail.getBooking();
        if (booking != null) {
            syncBookingSummary(booking);
            bookingRepository.save(booking);
        }
    }

    public Booking assignRoomToCustomer(Integer roomId, String customerId, String customerBookingId) {
        if (customerId == null || customerId.isBlank()) {
            throw new RuntimeException("Customer ID is required");
        }
        if (customerBookingId == null || customerBookingId.isBlank()) {
            throw new RuntimeException("Customer Booking ID is required");
        }

        Integer parsedCustomerId;
        Integer parsedCustomerBookingId;
        try {
            parsedCustomerId = Integer.parseInt(customerId.trim());
            parsedCustomerBookingId = Integer.parseInt(customerBookingId.trim());
        } catch (NumberFormatException ex) {
            throw new RuntimeException("Customer ID and Customer Booking ID must be numeric");
        }

        Customer customer = customerRepository.findById(parsedCustomerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        CustomerBooking customerBooking = customerBookingRepository.findById(parsedCustomerBookingId)
                .orElseThrow(() -> new RuntimeException("Customer booking not found"));

        if (!customer.getCustomerId().equals(customerBooking.getCustomer().getCustomerId())) {
            throw new RuntimeException("Customer ID does not match Customer Booking ID");
        }
        if (customerBooking.isAssigned()) {
            throw new RuntimeException("Customer booking is already assigned");
        }

        LocalDate checkIn = customerBooking.getCheckIn();
        LocalDate checkOut = customerBooking.getCheckOut();
        validateDateRange(checkIn, checkOut);

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getRoomType().equalsIgnoreCase(customerBooking.getRoomType())
                || !room.getRoomRank().equalsIgnoreCase(customerBooking.getRoomRank())) {
            throw new RuntimeException("Selected room does not match the requested room type/rank");
        }

        if (!isRoomAssignableForDates(room, checkIn, checkOut, List.of())) {
            throw new RuntimeException("Room is not available for the selected dates");
        }

        Booking booking = findOrCreateBookingForGroup(customerBooking.getGroupCode(), customer);
        createAssignment(booking, customerBooking, room);
        return booking;
    }

    public Map<String, Object> assignGroupBookings(String groupCode) {
        List<CustomerBooking> items = customerBookingRepository.findAllByGroupCodeOrderByIdAsc(groupCode);
        if (items.isEmpty()) {
            throw new RuntimeException("Customer booking group not found");
        }

        Customer customer = items.get(0).getCustomer();
        Booking booking = findOrCreateBookingForGroup(groupCode, customer);

        List<CustomerBooking> unassignedItems = items.stream()
                .filter(cb -> !cb.isAssigned())
                .sorted(Comparator.comparing(CustomerBooking::getId))
                .toList();

        List<PendingSelection> pendingSelections = new ArrayList<>();
        for (CustomerBooking customerBooking : unassignedItems) {
            validateDateRange(customerBooking.getCheckIn(), customerBooking.getCheckOut());
            Room selectedRoom = findFirstAvailableRoom(
                    customerBooking.getRoomType(),
                    customerBooking.getRoomRank(),
                    customerBooking.getCheckIn(),
                    customerBooking.getCheckOut(),
                    pendingSelections);

            if (selectedRoom == null) {
                throw new RuntimeException(
                        "No available room for " + customerBooking.getRoomType() + " " + customerBooking.getRoomRank()
                                + " in " + customerBooking.getCheckIn() + " -> " + customerBooking.getCheckOut());
            }

            pendingSelections.add(new PendingSelection(customerBooking, selectedRoom));
        }

        for (PendingSelection selection : pendingSelections) {
            createAssignment(booking, selection.customerBooking(), selection.room());
        }

        return Map.of(
                "bookingId", booking.getId(),
                "status", booking.getStatus(),
                "assignedCount", pendingSelections.size());
    }

    public Map<String, Object> getAvailabilitySummary(String type, String rank, LocalDate checkIn, LocalDate checkOut) {
        validateDateRange(checkIn, checkOut);
        List<Room> rooms = roomRepository.findByRoomTypeAndRoomRank(type, rank);
        long availableCount = rooms.stream()
                .filter(room -> isRoomAssignableForDates(room, checkIn, checkOut, List.of()))
                .count();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("type", type);
        response.put("rank", rank);
        response.put("checkIn", checkIn);
        response.put("checkOut", checkOut);
        response.put("totalRooms", rooms.size());
        response.put("availableCount", availableCount);
        response.put("unavailableCount", Math.max(0, rooms.size() - availableCount));
        response.put("available", availableCount > 0);
        return response;
    }

    public List<Map<String, Object>> getRoomsWithAvailability(LocalDate checkIn, LocalDate checkOut, String type, String rank) {
        List<Room> rooms = roomRepository.findAll(Sort.by("roomNumber").ascending());
        boolean hasDateRange = checkIn != null && checkOut != null;
        LocalDate today = LocalDate.now();
        if (hasDateRange) {
            validateDateRange(checkIn, checkOut);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Room room : rooms) {
            if (type != null && !type.isBlank() && !room.getRoomType().equalsIgnoreCase(type)) {
                continue;
            }
            if (rank != null && !rank.isBlank() && !room.getRoomRank().equalsIgnoreCase(rank)) {
                continue;
            }

            boolean availableForRange = !hasDateRange || isRoomAssignableForDates(room, checkIn, checkOut, List.of());
            boolean hasActiveBookingToday = !bookingDetailRepository.findActiveDetailsByDate(room, today).isEmpty();
            boolean hasNoShowCandidateToday = bookingDetailRepository.findCheckOutDetailsByDate(room, today).stream()
                    .anyMatch(this::canMarkNoShow);
            Map<String, Object> item = new HashMap<>();
            item.put("id", room.getId());
            item.put("roomNumber", room.getRoomNumber());
            item.put("roomType", room.getRoomType());
            item.put("roomRank", room.getRoomRank());
            item.put("status", room.getStatus());
            item.put("hasActiveBookingToday", hasActiveBookingToday);
            item.put("hasNoShowCandidateToday", hasNoShowCandidateToday);
            item.put("availableForRange", availableForRange);
            item.put("dateStatus", availableForRange ? "AVAILABLE" : "BOOKED");
            item.put("dateLabel", availableForRange ? "Available for selected dates" : "Booked in selected dates");
            result.add(item);
        }
        return result;
    }

    public Room getRepresentativeRoom(String type, String rank) {
        return roomRepository.findFirstByRoomTypeIgnoreCaseAndRoomRankIgnoreCaseOrderByIdAsc(type, rank);
    }

    private void createAssignment(Booking booking, CustomerBooking customerBooking, Room room) {
        BookingDetail detail = new BookingDetail();
        detail.setBooking(booking);
        detail.setRoom(room);
        detail.setPrice(room.getPrice());
        detail.setCheckInDate(customerBooking.getCheckIn());
        detail.setCheckOutDate(customerBooking.getCheckOut());
        detail.setActualCheckOutDate(null);
        detail.setStatus("ASSIGNED");
        bookingDetailRepository.save(detail);

        customerBooking.setBooking(booking);
        customerBooking.setAssignedRoom(room);
        customerBooking.setAssigned(true);
        customerBookingRepository.save(customerBooking);

        syncBookingSummary(booking);
        bookingRepository.save(booking);
    }

    private void validateStatusChange(Room room, String newStatus) {
        LocalDate today = LocalDate.now();
        List<BookingDetail> activeDetails = bookingDetailRepository.findActiveDetailsByDate(room, today);
        String currentStatus = room.getStatus() == null ? "" : room.getStatus().trim().toUpperCase();

        if ("AVAILABLE".equals(newStatus) && "HOUSEKEEPING".equals(currentStatus)) {
            return;
        }

        if (("OCCUPIED".equals(newStatus) || "CHECKED-OUT".equals(newStatus) || "RESERVED".equals(newStatus))
                && activeDetails.isEmpty()) {
            throw new RuntimeException("This room has no active booking for today");
        }

        if ("AVAILABLE".equals(newStatus) && !activeDetails.isEmpty()) {
            throw new RuntimeException("This room still has an active booking for today");
        }
    }

    private void applyActualCheckoutDate(Room room, LocalDate checkoutDate) {
        bookingDetailRepository.findActiveDetailsByDate(room, checkoutDate).stream()
                .findFirst()
                .ifPresent(detail -> {
                    detail.setActualCheckOutDate(checkoutDate);
                    bookingDetailRepository.save(detail);
                    dailyRevenueService.ensureRevenueForDate(checkoutDate);
                });
    }

    private void syncBookingsForRoom(Room room) {
        Set<Booking> bookings = new LinkedHashSet<>();
        for (BookingDetail detail : bookingDetailRepository.findAllByRoom(room)) {
            bookings.add(detail.getBooking());
        }
        for (Booking booking : bookings) {
            syncBookingSummary(booking);
            bookingRepository.save(booking);
            customerTierService.refreshTier(booking.getCustomer());
        }
    }

    private boolean canMarkNoShow(BookingDetail detail) {
        if (detail == null) {
            return false;
        }

        String detailStatus = detail.getStatus() == null ? "" : detail.getStatus().trim().toUpperCase();
        if ("NO_SHOW".equals(detailStatus)) {
            return false;
        }

        Booking booking = detail.getBooking();
        String bookingStatus = booking != null && booking.getStatus() != null
                ? booking.getStatus().trim().toUpperCase()
                : "";
        if ("COMPLETED".equals(bookingStatus)) {
            return false;
        }

        return !hasOperationalProgress(List.of(detail));
    }

    private Booking findOrCreateBookingForGroup(String groupCode, Customer customer) {
        return bookingRepository.findTopByGroupCode(groupCode)
                .orElseGet(() -> {
                    Booking newBooking = new Booking();
                    newBooking.setCustomer(customer);
                    newBooking.setGroupCode(groupCode);
                    newBooking.setStatus("RESERVED");
                    newBooking.setTotalAmount(BigDecimal.ZERO);
                    return bookingRepository.save(newBooking);
                });
    }

    private Room findFirstAvailableRoom(String roomType,
                                        String roomRank,
                                        LocalDate checkIn,
                                        LocalDate checkOut,
                                        List<PendingSelection> pendingSelections) {
        return roomRepository.findByRoomTypeAndRoomRank(roomType, roomRank).stream()
                .filter(room -> isRoomAssignableForDates(room, checkIn, checkOut, pendingSelections))
                .min(Comparator.comparing(Room::getRoomNumber))
                .orElse(null);
    }

    private boolean isRoomAssignableForDates(Room room,
                                             LocalDate checkIn,
                                             LocalDate checkOut,
                                             List<PendingSelection> pendingSelections) {
        if (room == null) {
            return false;
        }
        if ("HOUSEKEEPING".equalsIgnoreCase(room.getStatus())) {
            return false;
        }
        if (!bookingDetailRepository.findOverlappingDetails(room, checkIn, checkOut).isEmpty()) {
            return false;
        }
        for (PendingSelection selection : pendingSelections) {
            if (selection.room().getId().equals(room.getId())
                    && isDateOverlap(selection.customerBooking().getCheckIn(), selection.customerBooking().getCheckOut(), checkIn, checkOut)) {
                return false;
            }
        }
        return true;
    }

    private boolean isDateOverlap(LocalDate startA, LocalDate endA, LocalDate startB, LocalDate endB) {
        return startA.isBefore(endB) && endA.isAfter(startB);
    }

    private void validateDateRange(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new RuntimeException("Check-in and check-out are required");
        }
        if (!checkOut.isAfter(checkIn)) {
            throw new RuntimeException("Check-out must be after check-in");
        }
    }

    private BigDecimal calculateBookingTotal(Booking booking) {
        List<BookingDetail> details = bookingDetailRepository.findAllByBooking(booking);
        BigDecimal total = BigDecimal.ZERO;
        for (BookingDetail detail : details) {
            if (detail.getPrice() != null) {
                total = total.add(detail.getPrice());
            }
        }
        return total;
    }

    private void syncBookingSummary(Booking booking) {
        List<BookingDetail> details = bookingDetailRepository.findAllByBooking(booking);
        if (details.isEmpty()) {
            booking.setCheckInDate(null);
            booking.setCheckOutDate(null);
            booking.setTotalAmount(BigDecimal.ZERO);
            booking.setStatus("PENDING");
            return;
        }

        LocalDate minCheckIn = details.stream()
                .map(BookingDetail::getCheckInDate)
                .filter(date -> date != null)
                .min(LocalDate::compareTo)
                .orElse(null);
        LocalDate maxCheckOut = details.stream()
                .map(this::getEffectiveCheckOutDate)
                .filter(date -> date != null)
                .max(LocalDate::compareTo)
                .orElse(null);

        booking.setCheckInDate(minCheckIn);
        booking.setCheckOutDate(maxCheckOut);
        booking.setTotalAmount(calculateBookingTotal(booking));
        booking.setStatus(calculateBookingStatus(booking, details, minCheckIn, maxCheckOut));
    }

    private String calculateBookingStatus(Booking booking,
                                          List<BookingDetail> details,
                                          LocalDate minCheckIn,
                                          LocalDate maxCheckOut) {
        LocalDate today = LocalDate.now();
        boolean hasActiveToday = false;
        boolean hasOccupiedToday = false;
        boolean hasOperationalProgress = hasOperationalProgress(details);
        boolean allNoShow = details.stream()
                .allMatch(detail -> "NO_SHOW".equalsIgnoreCase(detail.getStatus()));
        String previousStatus = booking.getStatus() == null ? "" : booking.getStatus().trim().toUpperCase();

        for (BookingDetail detail : details) {
            if ("NO_SHOW".equalsIgnoreCase(detail.getStatus())) {
                continue;
            }
            String roomStatus = detail.getRoom() != null ? detail.getRoom().getStatus() : null;
            LocalDate effectiveCheckOut = getEffectiveCheckOutDate(detail);
            if (detail.getCheckInDate() != null && effectiveCheckOut != null
                    && !today.isBefore(detail.getCheckInDate())
                    && today.isBefore(effectiveCheckOut)) {
                hasActiveToday = true;
                if (roomStatus != null && "OCCUPIED".equalsIgnoreCase(roomStatus)) {
                    hasOccupiedToday = true;
                }
            }
        }

        if (hasOccupiedToday) {
            return "OCCUPIED";
        }
        if (allNoShow) {
            return "NO_SHOW";
        }
        if (hasActiveToday) {
            return "RESERVED";
        }
        if (maxCheckOut != null && !today.isBefore(maxCheckOut)) {
            if (hasOperationalProgress
                    || "OCCUPIED".equals(previousStatus)
                    || "CHECKED-OUT".equals(previousStatus)
                    || "COMPLETED".equals(previousStatus)) {
                return "COMPLETED";
            }
            return "NO_SHOW";
        }
        if (minCheckIn != null && today.isBefore(minCheckIn)) {
            return "RESERVED";
        }
        return "RESERVED";
    }

    private boolean hasOperationalProgress(List<BookingDetail> details) {
        for (BookingDetail detail : details) {
            if ("NO_SHOW".equalsIgnoreCase(detail.getStatus())) {
                continue;
            }
            String roomStatus = detail.getRoom() != null ? detail.getRoom().getStatus() : null;
            if (roomStatus != null && (
                    "OCCUPIED".equalsIgnoreCase(roomStatus)
                            || "CHECKED-OUT".equalsIgnoreCase(roomStatus)
                            || "HOUSEKEEPING".equalsIgnoreCase(roomStatus))) {
                return true;
            }
        }
        return false;
    }

    private LocalDate getEffectiveCheckOutDate(BookingDetail detail) {
        return detail.getActualCheckOutDate() != null ? detail.getActualCheckOutDate() : detail.getCheckOutDate();
    }

    private record PendingSelection(CustomerBooking customerBooking, Room room) {
    }
}
