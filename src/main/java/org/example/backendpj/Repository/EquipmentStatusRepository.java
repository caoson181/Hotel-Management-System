package org.example.backendpj.Repository;

import org.example.backendpj.Entity.EquipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentStatusRepository
        extends JpaRepository<EquipmentStatus, Integer> {

    List<EquipmentStatus> findByRoomId(Integer roomId);

    void deleteByRoomIdAndArea(Integer roomId, String area);

    void deleteByRoomId(Integer roomId);
    List<EquipmentStatus> findByIsMissingTrue();
}