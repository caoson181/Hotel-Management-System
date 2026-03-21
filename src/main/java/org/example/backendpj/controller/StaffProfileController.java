package org.example.backendpj.controller;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.time.LocalDate;

@Controller
@RequestMapping("/staff/profile/manage")
public class StaffProfileController {

    @Autowired
    private UserRepository userRepository;

    // SHOW PROFILE PAGE
    @GetMapping
    public String showProfile(org.springframework.ui.Model model, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        model.addAttribute("user", user);
        return "pages/staff/profile"; // your profile.html
    }

    // UPDATE PROFILE
    @PostMapping("/update")
    public String updateProfile(
            @RequestParam String username,
            @RequestParam String fullName,
            @RequestParam String gender,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate dateOfBirth,
            Principal principal,
            RedirectAttributes redirectAttributes) {

        System.out.println("STAFF UPDATE HIT");

        User currentUser = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        currentUser.setUsername(username);
        currentUser.setFullName(fullName);
        currentUser.setGender(gender);
        currentUser.setDateOfBirth(dateOfBirth);

        userRepository.save(currentUser);

        // FIX HERE
        UsernamePasswordAuthenticationToken newAuth = new UsernamePasswordAuthenticationToken(
                username,
                currentUser.getPassword(),
                SecurityContextHolder.getContext().getAuthentication().getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(newAuth);
        redirectAttributes.addFlashAttribute("successProfile", "Profile updated successfully!");

        return "redirect:/staff/profile";
    }
}
