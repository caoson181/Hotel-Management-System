package org.example.backendpj.controller;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import java.security.Principal;

@Controller
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserService userService;


    @PostMapping("/update")
    public String updateProfile(
            @RequestParam String fullName,
            @RequestParam String email,
            @RequestParam String phoneNumber,
            Authentication authentication) {

        Object principal = authentication.getPrincipal();
        String usernameOrEmail;

        if (principal instanceof OAuth2User oauthUser) {
            usernameOrEmail = oauthUser.getAttribute("email");
        } else {
            usernameOrEmail = authentication.getName();
        }

        userService.updateProfile(
                usernameOrEmail,
                fullName,
                email,
                phoneNumber
        );

        return "redirect:/profile";
    }
}