package org.example.backendpj.dto;

import java.time.LocalDate;

public class SimpleBookingDTO {
    private Integer customerId;
    private String roomType;
    private String roomRank;

    private LocalDate checkIn;
    private LocalDate checkOut;

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public String getRoomRank() { return roomRank; }
    public void setRoomRank(String roomRank) { this.roomRank = roomRank; }

    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }
    public LocalDate getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }
}