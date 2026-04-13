package org.example.backendpj.Repository;

import org.example.backendpj.Entity.RoomComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomCommentRepository extends JpaRepository<RoomComment, Integer> {

    List<RoomComment> findByRoomTypeIgnoreCaseAndRoomRankIgnoreCaseOrderByCreatedAtDesc(String roomType, String roomRank);
}
