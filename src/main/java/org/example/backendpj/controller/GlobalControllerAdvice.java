package org.example.backendpj.controller;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.example.backendpj.Service.UserService;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Entity.UserAvatar;
import org.example.backendpj.Repository.UserAvatarRepository;

import java.security.Principal;

@ControllerAdvice
public class GlobalControllerAdvice {

    private final UserService userService;
    private final UserAvatarRepository avatarRepo;

    public GlobalControllerAdvice(UserService userService,
            UserAvatarRepository avatarRepo) {
        this.userService = userService;
        this.avatarRepo = avatarRepo;
    }

    @ModelAttribute("currentUser")
    public User getCurrentUser(Principal principal) {
        if (principal == null)
            return null;

        if (principal instanceof UsernamePasswordAuthenticationToken) {
            return userService.findByUsernameOrEmail(principal.getName());
        }

        if (principal instanceof OAuth2AuthenticationToken oauth) {
            String email = oauth.getPrincipal().getAttribute("email");
            return userService.findByEmail(email);
        }

        return null;
    }

    // 🔥 THÊM ĐOẠN NÀY
    @ModelAttribute("avatarNavbar")
    public UserAvatar getAvatar(Principal principal) {
        if (principal == null)
            return null;

        User user = userService.findByUsernameOrEmail(principal.getName());
        if (user == null)
            return null;

        return avatarRepo
                .findByUser_IdAndIsCurrentTrue(user.getId())
                .orElse(null);
    }
}