package org.example.backendpj.Service;

import org.example.backendpj.Entity.EquipmentStatus;
import org.example.backendpj.Entity.EquipmentTemplate;
import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.EquipmentStatusRepository;
import org.example.backendpj.Repository.EquipmentTemplateRepository;
import org.example.backendpj.Repository.RoomRepository;
import org.example.backendpj.dto.EquipmentCheckRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentTemplateRepository templateRepo;

    @Autowired
    private EquipmentStatusRepository equipmentStatusRepository;

    @Autowired
    private RoomRepository roomRepository;

    /**
     * Retrieves equipment status organized by area (e.g., bedroom1, kitchen).
     * Maps templates to current saved statuses for a specific room.
     */
    public Map<String, List<Map<String, Object>>> getEquipmentByRoom(Integer roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + roomId));

        String rank = room.getRoomRank();

        // 1. Get all standard equipment for this room's rank (Standard, Deluxe, etc.)
        List<EquipmentTemplate> templates = templateRepo.findByRoomRank(rank);

        // 2. Get all currently saved statuses/issues for this specific room
        List<EquipmentStatus> statuses = equipmentStatusRepository.findByRoomId(roomId);

        Map<String, List<Map<String, Object>>> result = new HashMap<>();

        for (EquipmentTemplate t : templates) {
            String area = t.getArea();
            String name = t.getEquipmentName();

            // Find if there is a saved status for this specific piece of equipment
            EquipmentStatus status = statuses.stream()
                    .filter(s -> s.getArea().equalsIgnoreCase(area)
                            && s.getEquipmentName().equalsIgnoreCase(name))
                    .findFirst()
                    .orElse(null);

            Map<String, Object> item = new HashMap<>();
            item.put("name", name);
            // If status is null, it hasn't been checked yet
            item.put("checked", status != null && Boolean.TRUE.equals(status.getIsChecked()));
            item.put("missing", status != null && Boolean.TRUE.equals(status.getIsMissing()));

            result.computeIfAbsent(area, k -> new ArrayList<>()).add(item);
        }

        return result;
    }

    /**
     * Saves the check results for a specific area.
     * Uses @Transactional to ensure that old data is only deleted if new data is saved successfully.
     */
    @Transactional
    public void saveCheck(EquipmentCheckRequest request) {
        Integer roomId = request.getRoomId();
        String area = request.getArea();

        // 1. Clear previous records for this specific area to prevent duplicates
        equipmentStatusRepository.deleteByRoomIdAndArea(roomId, area);

        // 2. Save items marked as present
        if (request.getCheckedItems() != null) {
            for (String itemName : request.getCheckedItems()) {
                saveEquipmentStatus(roomId, area, itemName, true, false);
            }
        }

        // 3. Save items marked as missing/damaged
        if (request.getMissingItems() != null) {
            for (String itemName : request.getMissingItems()) {
                saveEquipmentStatus(roomId, area, itemName, false, true);
            }
        }
    }

    /**
     * Internal helper to build and save EquipmentStatus entities.
     */
    private void saveEquipmentStatus(Integer roomId, String area, String name, boolean isChecked, boolean isMissing) {
        EquipmentStatus status = new EquipmentStatus();
        status.setRoomId(roomId);
        status.setArea(area);
        status.setEquipmentName(name);
        status.setIsChecked(isChecked);
        status.setIsMissing(isMissing);
        equipmentStatusRepository.save(status);
    }

    /**
     * Finalizes the cleaning process.
     * Clears all temporary check data and resets the room to AVAILABLE.
     */
    @Transactional
    public void completeCleaning(Integer roomId) {
        // 1. Remove all check records for this room
        equipmentStatusRepository.deleteByRoomId(roomId);

        // 2. Update the main Room status
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setStatus("AVAILABLE");
        roomRepository.save(room);
    }

    /**
     * Returns all equipment currently flagged as missing for the Manager dashboard.
     */
    public List<EquipmentStatus> getMissingEquipment() {
        return equipmentStatusRepository.findByIsMissingTrue();
    }

    /**
     * Resolves a specific missing item issue.
     * Marks it as present (checked) and no longer missing.
     */
    @Transactional
    public void resolveIssue(Integer id) {
        EquipmentStatus status = equipmentStatusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment issue not found with ID: " + id));

        status.setIsMissing(false);
        status.setIsChecked(true);

        equipmentStatusRepository.save(status);
    }
    @Transactional
    public void resolveByDetails(Integer roomId, String area, String name) {
        // 1. Find all statuses for this room
        List<EquipmentStatus> statuses = equipmentStatusRepository.findByRoomId(roomId);

        // 2. Filter for the specific item that is currently marked as missing
        EquipmentStatus target = statuses.stream()
                .filter(s -> s.getArea().equalsIgnoreCase(area)
                        && s.getEquipmentName().equalsIgnoreCase(name)
                        && Boolean.TRUE.equals(s.getIsMissing()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Missing item not found in database"));

        // 3. Update the state
        target.setIsMissing(false);
        target.setIsChecked(true);

        equipmentStatusRepository.save(target);
    }
}