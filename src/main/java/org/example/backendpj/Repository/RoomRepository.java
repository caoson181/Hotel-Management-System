package org.example.backendpj.Repository;

import org.example.backendpj.Entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Integer> {

        Optional<Room> findByRoomNumber(String roomNumber);

        List<Room> findByStatus(String status);

        List<Room> findByRoomNumberContainingIgnoreCase(String roomNumber);

        List<Room> findByRoomTypeContainingIgnoreCase(String roomType);

        List<Room> findByRoomTypeAndRoomRank(String roomType, String roomRank);

        @Query("""
                            SELECT r FROM Room r
                            WHERE CAST(r.roomNumber AS string) LIKE CONCAT('%', :keyword, '%')
                               OR LOWER(r.roomType) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        """)
        Page<Room> search(@Param("keyword") String keyword, Pageable pageable);

        Page<Room> findByRoomNumberContainingIgnoreCaseOrRoomTypeContainingIgnoreCase(
                        String roomNumber,
                        String roomType,
                        Pageable pageable);

        Room findFirstByRoomTypeIgnoreCaseAndRoomRankIgnoreCaseOrderByIdAsc(String type, String rank);

        @Query("SELECT r FROM Room r WHERE r.roomType = :type AND r.roomRank = :rank ORDER BY r.id ASC")
        List<Room> findByTypeAndRank(@Param("type") String type,
                        @Param("rank") String rank);
}
