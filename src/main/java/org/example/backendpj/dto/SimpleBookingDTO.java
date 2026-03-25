package org.example.backendpj.dto;

public class SimpleBookingDTO {
    private Integer customerId;
    private String roomType;
    private String roomRank;

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public String getRoomRank() { return roomRank; }
    public void setRoomRank(String roomRank) { this.roomRank = roomRank; }
}