package org.example.backendpj.controller;

import org.example.backendpj.Entity.Room;
import org.example.backendpj.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomApiController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/search")
    public Map<String, Object> searchRooms(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "roomNumber") String sortField,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<Room> roomPage = roomService.search(keyword, page, sortField, sortDir);

        Map<String, Object> response = new HashMap<>();
        response.put("rooms", roomPage.getContent());
        response.put("totalPages", roomPage.getTotalPages());

        return response;
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRoomStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");
        Room updatedRoom = roomService.updateStatus(id, newStatus);
        return ResponseEntity.ok(updatedRoom);
    }

    @PostMapping("/{id}/mark-no-show")
    public ResponseEntity<?> markNoShow(@PathVariable Integer id) {
        roomService.markNoShowForToday(id);
        return ResponseEntity.ok(Map.of("status", "NO_SHOW"));
    }

    @GetMapping("/representative")
    public ResponseEntity<?> getRepresentativeRoom(
            @RequestParam String type,
            @RequestParam String rank) {

        Room room = roomService.getRepresentativeRoom(type, rank);

        if (room == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(room);
    }

    @GetMapping("/availability")
    public ResponseEntity<?> getAvailabilitySummary(
            @RequestParam String type,
            @RequestParam String rank,
            @RequestParam String checkIn,
            @RequestParam String checkOut) {
        return ResponseEntity.ok(roomService.getAvailabilitySummary(
                type,
                rank,
                LocalDate.parse(checkIn),
                LocalDate.parse(checkOut)));
    }

    @GetMapping("/availability-list")
    public ResponseEntity<List<Map<String, Object>>> getAvailabilityList(
            @RequestParam(required = false) String checkIn,
            @RequestParam(required = false) String checkOut,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String rank) {
        LocalDate parsedCheckIn = (checkIn == null || checkIn.isBlank()) ? null : LocalDate.parse(checkIn);
        LocalDate parsedCheckOut = (checkOut == null || checkOut.isBlank()) ? null : LocalDate.parse(checkOut);
        return ResponseEntity.ok(roomService.getRoomsWithAvailability(parsedCheckIn, parsedCheckOut, type, rank));
    }

    @GetMapping("/{id}/timeline")
    public ResponseEntity<Map<String, Object>> getRoomTimeline(@PathVariable Integer id) {
        return ResponseEntity.ok(roomService.getRoomTimeline(id));
    }
}
