package org.example.backendpj.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "equipment_status", indexes = {
        @Index(name = "idx_room_rank", columnList = "room_rank")
})
public class EquipmentTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "room_rank")
    private String roomRank;
    @Column(name = "area")
    private String area;
    @Column(name = "equipment_name")
    private String equipmentName;

    // Required by JPA
    public EquipmentTemplate() {}

    public Integer getId() {
        return id;
    }
    public String getRoomRank() {
        return roomRank;
    }
    public String getArea() {
        return area;
    }
    public String getEquipmentName() {
        return equipmentName;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public void setRoomRank(String roomRank) {
        this.roomRank = roomRank;
    }
    public void setArea(String area) {
        this.area = area;
    }
    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }
}