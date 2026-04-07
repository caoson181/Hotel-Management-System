package org.example.backendpj.Service;

import org.example.backendpj.Entity.DailyRevenue;
import org.example.backendpj.Repository.DailyRevenueRepository;
import org.example.backendpj.dto.RevenueDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
public class DailyRevenueService {

    @Autowired
    private DailyRevenueRepository repo;

    public List<RevenueDTO> getRevenueByMonth(String monthStr) {

        String[] parts = monthStr.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);

        List<DailyRevenue> list = repo.findByMonth(year, month);

        return list.stream().map(d -> {

            double booking = d.getBookingRevenue() != null ? d.getBookingRevenue() : 0;
            double rental = d.getRentalRevenue() != null ? d.getRentalRevenue() : 0;
            double salary = d.getSalaryCost() != null ? d.getSalaryCost() : 0;
            double other = d.getOtherCost() != null ? d.getOtherCost() : 0;

            double revenue = booking + rental;
            double profit = revenue - salary - other;

            return new RevenueDTO(
                    d.getDate().toString(),
                    d.getTotalGuests(),
                    d.getRoomsBooked(),
                    revenue,
                    profit);

        }).toList();
    }
}