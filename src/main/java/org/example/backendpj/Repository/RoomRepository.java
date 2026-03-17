package org.example.backendpj.Repository;

import org.example.backendpj.Entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    Optional<Room> findByRoomNumber(String roomNumber);

    List<Room> findByStatus(String status);

    List<Room> findByRoomNumberContainingIgnoreCase(String roomNumber);

    List<Room> findByRoomTypeContainingIgnoreCase(String roomType);
}