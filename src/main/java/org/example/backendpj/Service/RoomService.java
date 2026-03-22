package org.example.backendpj.Service;

import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Page<Room> search(String keyword, int page, String sortField, String sortDir) {
        int pageSize = 20;
        sortField = sortField.trim();
        sortDir = sortDir.trim();
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(
                page,
                pageSize,
                sort
        );

        if (keyword != null && !keyword.trim().isEmpty()) {
            return roomRepository.search(keyword, pageable);
        }

        return roomRepository.findAll(pageable);
    }

    public Room updateStatus(Integer id, String newStatus) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        room.setStatus(newStatus);
        return roomRepository.save(room);
    }

}
