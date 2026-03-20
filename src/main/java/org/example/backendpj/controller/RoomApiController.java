package org.example.backendpj.controller;

import org.example.backendpj.Entity.Room;
import org.example.backendpj.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
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
    @RequestParam(defaultValue = "asc") String sortDir)
        {

        Page<Room> roomPage = roomService.search(keyword, page,sortField, sortDir);

        Map<String, Object> response = new HashMap<>();
        response.put("rooms", roomPage.getContent());
        response.put("totalPages", roomPage.getTotalPages());

        return response;
    }
}