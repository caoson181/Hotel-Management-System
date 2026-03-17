package org.example.backendpj.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Room")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer id;

    @Column(name = "room_number", nullable = false, unique = true, length = 20)
    private String roomNumber;

    @Column(name = "room_type", nullable = false, length = 50)
    private String roomType;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "room_rank")
    private String roomRank;

    @Column(name = "description")
    private String description;

    @Column(name = "picture")
    private String picture;

    public Room() {}

    // ===== Getter & Setter =====

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }

    public String getRoomRank() { return roomRank; }
    public void setRoomRank(String roomRank) { this.roomRank = roomRank; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPicture() { return picture; }
    public void setPicture(String picture) { this.picture = picture; }
}