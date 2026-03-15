package org.example.backendpj.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {



    // ================= ADMIN HOME =================

    @GetMapping("/index")
    public String index(){
        return "index";
    }

    // ================= AUTH =================

    @GetMapping("/login")
    public String login(){
        return "login";
    }

    @GetMapping("/forgot-password")
    public String forgotPassword(){
        return "forgot-password";
    }

    @GetMapping("/reset-password")
    public String resetPassword(){
        return "reset-password";
    }

    // ================= ROOMS =================

    @GetMapping("/rooms/view-room-status")
    public String viewRoomStatus(){
        return "pages/rooms/view-room-status";
    }

    @GetMapping("/rooms/check-equipment")
    public String checkEquipment(){
        return "pages/rooms/check-equipment";
    }

    @GetMapping("/rooms/check-in-out")
    public String checkInOut(){
        return "pages/rooms/check-in-out";
    }

    // ================= STAFF =================

    @GetMapping("/staff/manage-staff")
    public String manageStaff(){
        return "pages/staff/manage-staff";
    }

    @GetMapping("/staff/view-staff")
    public String viewStaff(){
        return "pages/staff/view-staff";
    }

    // ================= USERS =================

    @GetMapping("/users/manage-users")
    public String manageUsers(){
        return "pages/users/manage-users";
    }

    @GetMapping("/profile")
    public String profile() {
        return "homepage/profile";
    }

    // ================= REVENUE =================

    @GetMapping("/revenue/view-revenue")
    public String viewRevenue(){
        return "pages/revenue/view-revenue";
    }

    // ================= REPORTS =================

    @GetMapping("/reports/view-reports")
    public String viewReports(){
        return "pages/reports/view-reports";
    }

}