package org.example.backendpj.controller;

import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.RoomRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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
    public List<Room> getAllRooms(

            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "roomNumber") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {

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
                    .filter(room ->
                            room.getRoomNumber().toLowerCase().contains(keyword)
                                    || room.getRoomType().toLowerCase().contains(keyword)
                    )
                    .toList();
        }

        return rooms;
    }

    // ===============================
    // Get Room Detail
    // ===============================
    @GetMapping("/api/{id}")
    @ResponseBody
    public Room getRoomById(@PathVariable Integer id) {
        Optional<Room> room = roomRepository.findById(id);
        return room.orElse(null);
    }

    // ===============================
    // Add Room
    // ===============================
    @PostMapping("/api")
    @ResponseBody
    public ResponseEntity<?> addRoom(@RequestBody Room room) {

        Optional<Room> existingRoom =
                roomRepository.findByRoomNumber(room.getRoomNumber());

        if (existingRoom.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Room number already exists");
        }

        Room savedRoom = roomRepository.save(room);

        return ResponseEntity.ok(savedRoom);
    }

    // ===============================
    // Update Room
    // ===============================
    @PutMapping("/api/{id}")
    @ResponseBody
    public Room updateRoom(
            @PathVariable Integer id,
            @RequestBody Room updatedRoom
    ) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setRoomNumber(updatedRoom.getRoomNumber());
        room.setRoomType(updatedRoom.getRoomType());
        room.setStatus(updatedRoom.getStatus());
        room.setPrice(updatedRoom.getPrice());
        room.setBasePrice(updatedRoom.getBasePrice());
        room.setRoomRank(updatedRoom.getRoomRank());
        room.setDescription(updatedRoom.getDescription());
        room.setPicture(updatedRoom.getPicture());

        return roomRepository.save(room);
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


}
