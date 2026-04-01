package org.example.backendpj.Repository;

import org.example.backendpj.Entity.EquipmentTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipmentTemplateRepository
        extends JpaRepository<EquipmentTemplate, Integer> {

    List<EquipmentTemplate> findByRoomRank(String roomRank);
}