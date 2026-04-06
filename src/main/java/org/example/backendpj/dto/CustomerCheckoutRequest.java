package org.example.backendpj.dto;

import java.util.List;

public class CustomerCheckoutRequest {
    private String payMode; // PAY_NOW or PAY_LATER
    private List<CartItem> items;

    public String getPayMode() {
        return payMode;
    }

    public void setPayMode(String payMode) {
        this.payMode = payMode;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public static class CartItem {
        private String roomType;
        private String roomRank;
        private String checkIn;
        private String checkOut;
        private Integer guests;
        private Double price;

        public String getRoomType() {
            return roomType;
        }

        public void setRoomType(String roomType) {
            this.roomType = roomType;
        }

        public String getRoomRank() {
            return roomRank;
        }

        public void setRoomRank(String roomRank) {
            this.roomRank = roomRank;
        }

        public String getCheckIn() {
            return checkIn;
        }

        public void setCheckIn(String checkIn) {
            this.checkIn = checkIn;
        }

        public String getCheckOut() {
            return checkOut;
        }

        public void setCheckOut(String checkOut) {
            this.checkOut = checkOut;
        }

        public Integer getGuests() {
            return guests;
        }

        public void setGuests(Integer guests) {
            this.guests = guests;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }
    }
}

