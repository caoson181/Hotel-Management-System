package org.example.backendpj.controller;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.Service.AvatarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@Controller
@RequestMapping("/staff/profile/avatar")
public class AvatarController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AvatarService avatarService;

    @PostMapping("/upload")
    public String uploadAvatar(@RequestParam("file") MultipartFile file,
            Principal principal) throws Exception {

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        avatarService.uploadAvatar(user, file);

        return "redirect:/staff/profile";
    }
}