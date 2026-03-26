package org.example.backendpj.controller;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Entity.UserAvatar;
import org.example.backendpj.Repository.UserAvatarRepository;
import org.example.backendpj.Service.AvatarService;
import org.example.backendpj.Service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
                phoneNumber);

        return "redirect:/profile";
    }

    @Autowired
    private UserAvatarRepository avatarRepo;

    @Autowired
    private AvatarService avatarService;

    @PostMapping("/avatar/upload")
    public String uploadAvatar(@RequestParam("file") MultipartFile file,
            Principal principal) throws Exception {

        User user = null;

        if (principal instanceof UsernamePasswordAuthenticationToken) {
            // login thường
            user = userService.findByUsernameOrEmail(principal.getName());
        } else if (principal instanceof org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken oauth) {
            String email = oauth.getPrincipal().getAttribute("email");
            user = userService.findByEmail(email);
        }

        avatarService.uploadAvatar(user, file);

        return "redirect:/profile";
    }

}