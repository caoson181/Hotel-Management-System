package org.example.backendpj.controller;

import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.RoomRepository;
import org.example.backendpj.Service.RoomService;
import org.example.backendpj.dto.RoomStatusRequest;
import org.example.backendpj.dto.RoomStatusResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.ui.Model;

@Controller
@RequestMapping("/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/view-room-status")
    public String viewRoomStatusPage(Model model) {

        List<Room> rooms = roomRepository.findAll();
        model.addAttribute("rooms", rooms);

        return "pages/rooms/view-room-status";
    }

    // ===============================
    // Get All Rooms
    // ===============================
    @GetMapping("/api")
    @ResponseBody
    public List<RoomStatusResponse> getAllRooms(

            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "roomNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        List<Room> rooms = roomRepository.findAll(sort);

        // Filter by status
        if (status != null && !status.equalsIgnoreCase("all")) {
            rooms = rooms.stream()
                    .filter(room -> room.getStatus().equalsIgnoreCase(status))
                    .toList();
        }

        // Search room number or type
        if (search != null && !search.isEmpty()) {
            String keyword = search.toLowerCase();
            rooms = rooms.stream()
                    .filter(room -> room.getRoomNumber().toLowerCase().contains(keyword)
                            || room.getRoomType().toLowerCase().contains(keyword))
                    .toList();
        }

        return rooms.stream()
                .map(this::toRoomStatusResponse)
                .toList();
    }

    // ===============================
    // Get Room Detail
    // ===============================
    @GetMapping("/api/{id}")
    @ResponseBody
    public RoomStatusResponse getRoomById(@PathVariable Integer id) {
        Optional<Room> room = roomRepository.findById(id);
        return room.map(this::toRoomStatusResponse).orElse(null);
    }

    // ===============================
    // Add Room
    // ===============================
    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<?> addRoom(@RequestBody RoomStatusRequest request) {

        Room room = new Room();
        applyRoomStatusRequest(room, request);

        Optional<Room> existingRoom = roomRepository.findByRoomNumber(room.getRoomNumber());

        if (existingRoom.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Room number already exists");
        }

        Room savedRoom = roomRepository.save(room);

        return ResponseEntity.ok(toRoomStatusResponse(savedRoom));
    }

    // ===============================
    // Update Room
    // ===============================
    @PutMapping("/api/{id}")
    @ResponseBody
    public RoomStatusResponse updateRoom(
            @PathVariable Integer id,
            @RequestBody RoomStatusRequest request) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        applyRoomStatusRequest(room, request);

        return toRoomStatusResponse(roomRepository.save(room));
    }

    // ===============================
    // Delete Room
    // ===============================
    @DeleteMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<?> deleteRoom(@PathVariable Integer id) {

        if (!roomRepository.existsById(id)) {
            return ResponseEntity
                    .badRequest()
                    .body("Room not found");
        }
        roomRepository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    // Assign CustomerID to Room //
    @Autowired
    private RoomService roomService;

    @PostMapping("/api/{roomId}/assign")
    @ResponseBody
    public ResponseEntity<?> assignRoom(
            @PathVariable Integer roomId,
            @RequestBody Map<String, String> request) {
        String customerId = request.get("customerId");
        String customerBookingId = request.get("customerBookingId");
        roomService.assignRoomToCustomer(roomId, customerId, customerBookingId);
        return ResponseEntity.ok().build();
    }

    // ===============================
    // Filter rooms by type + rank
    // ===============================
    @GetMapping("/api/filter")
    @ResponseBody
    public List<Room> getRoomsByTypeAndRank(
            @RequestParam String type,
            @RequestParam String rank)
    {return roomRepository.findByRoomTypeAndRoomRank(type, rank);}

    private void applyRoomStatusRequest(Room room, RoomStatusRequest request) {
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setStatus(request.getStatus());
        room.setPrice(request.getPrice());
        room.setBasePrice(request.getBasePrice());
        room.setRoomRank(request.getRoomRank());
        room.setDescription(request.getDescription());
    }

    private RoomStatusResponse toRoomStatusResponse(Room room) {
        RoomStatusResponse response = new RoomStatusResponse();
        response.setId(room.getId());
        response.setRoomNumber(room.getRoomNumber());
        response.setRoomType(room.getRoomType());
        response.setStatus(room.getStatus());
        response.setBasePrice(room.getBasePrice());
        response.setPrice(room.getPrice());
        response.setRoomRank(room.getRoomRank());
        response.setDescription(room.getDescription());
        return response;
    }
}
