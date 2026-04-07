package org.example.backendpj.controller;

import org.example.backendpj.Service.DailyRevenueService;
import org.example.backendpj.dto.RevenueDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/revenue")
@CrossOrigin
public class DailyRevenueController {

    @Autowired
    private DailyRevenueService service;

    @GetMapping
    public List<RevenueDTO> getRevenue(@RequestParam String month) {
        return service.getRevenueByMonth(month);
    }
}