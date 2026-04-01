package org.example.backendpj.dto;

import java.util.List;

public class EquipmentCheckRequest {
    private Integer roomId;
    private String area;
    private List<String> checkedItems;
    private List<String> missingItems;

    public Integer getRoomId() {
        return roomId;
    }
    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }
    public String getArea() {
        return area;
    }
    public void setArea(String area) {
        this.area = area;
    }
    public List<String> getCheckedItems() {
        return checkedItems;
    }
    public void setCheckedItems(List<String> checkedItems) {
        this.checkedItems = checkedItems;
    }
    public List<String> getMissingItems() {
        return missingItems;
    }
    public void setMissingItems(List<String> missingItems) {
        this.missingItems = missingItems;
    }
}
