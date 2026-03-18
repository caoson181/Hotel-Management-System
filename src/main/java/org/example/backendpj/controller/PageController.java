package org.example.backendpj.controller;

import org.example.backendpj.Service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;
import org.springframework.security.core.Authentication;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.UserRepository;

import java.security.Principal;



@Controller
public class PageController {

    private final UserRepository userRepository;
    private final UserService userService;


    public PageController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    // ================= ADMIN HOME =================

    @GetMapping("/index")
    public String index(Model model, Principal principal) {

        if (principal != null) {
            String username = principal.getName();
            User user = userService.findByUsername(username);
            model.addAttribute("currentUser", user);
        }

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



    @GetMapping("/rooms/check-equipment")
    public String checkEquipment(){
        return "pages/rooms/check-equipment";
    }

    @GetMapping("/rooms/view-room")
    public String viewRoom() {
        return "pages/rooms/view-room";
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
    public String profile(Model model, Authentication authentication) {

        String login = null;

        if (authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.User userDetails) {
            login = userDetails.getUsername();
        }

        else if (authentication.getPrincipal() instanceof org.springframework.security.oauth2.core.user.OAuth2User oauthUser) {
            login = oauthUser.getAttribute("email");
        }

        User user = userRepository
                .findByUsernameOrEmail(login, login)
                .orElse(null);

        model.addAttribute("user", user);

        return "homepage/profile";
    }
    @GetMapping("/staff/profile")
    public String staffProfile(Model model, Principal principal) {
        User user = userService.findByUsername(principal.getName());
        model.addAttribute("user", user);
        return "pages/staff/profile";
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