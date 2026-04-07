package org.example.backendpj.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueDTO {
    private String date;
    private Integer totalGuests;
    private Integer roomsBooked;
    private Double revenue;
    private Double profit;
    private Double bookingRevenue;
    private Double rentalRevenue;
    private Double salaryCost;
    private Double otherCost;
}
