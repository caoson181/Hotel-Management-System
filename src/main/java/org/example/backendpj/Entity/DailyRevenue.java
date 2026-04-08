package org.example.backendpj.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "daily_revenue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DailyRevenue {

    @Id
    private LocalDate date;

    @Column(name = "total_guests")
    private Integer totalGuests;

    @Column(name = "rooms_booked")
    private Integer roomsBooked;

    @Column(name = "booking_revenue")
    private Double bookingRevenue;

    @Column(name = "rental_revenue")
    private Double rentalRevenue;

    @Column(name = "salary_cost")
    private Double salaryCost;

    @Column(name = "other_cost")
    private Double otherCost;

    @Column(name = "profit")
    private Double profit;

}
