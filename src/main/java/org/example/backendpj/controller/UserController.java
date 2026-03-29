package org.example.backendpj.controller;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.UserRepository;

import org.example.backendpj.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.security.Principal;

@Controller
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users/manage")
    public String manageUser(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(required = false) Boolean status,
            @RequestParam(defaultValue = "0") int page,
            Model model) {

        Page<User> userPage;

        // ===== FILTER LOGIC =====
        if (keyword.isEmpty()) {
            if (status == null) {
                userPage = userRepository.findByRole("Customer", PageRequest.of(page, 10));
            } else {
                userPage = userRepository
                        .findByRoleAndEnabled("Customer", status, PageRequest.of(page, 10));
            }
        } else {
            if (status == null) {
                userPage = userRepository
                        .findByFullNameContainingIgnoreCaseAndRole(keyword, "Customer", PageRequest.of(page, 10));
            } else {
                userPage = userRepository
                        .findByFullNameContainingIgnoreCaseAndRoleAndEnabled(
                                keyword, "Customer", status, PageRequest.of(page, 10));
            }
        }

        // ===== COUNT =====
        long totalUsers = userRepository.countByRole("Customer");
        long activeUsers = userRepository.countByRoleAndEnabled("Customer", true);
        long disabledUsers = userRepository.countByRoleAndEnabled("Customer", false);

        // ===== MODEL =====
        model.addAttribute("userList", userPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", userPage.getTotalPages());
        model.addAttribute("keyword", keyword);
        model.addAttribute("status", status);

        model.addAttribute("totalUsers", totalUsers);
        model.addAttribute("activeUsers", activeUsers);
        model.addAttribute("disabledUsers", disabledUsers);

        return "pages/users/manage-users";
    }


    @GetMapping("/user/toggle/{id}")
    public String toggleUser(@PathVariable Integer id,
                             RedirectAttributes redirectAttributes) {

        User user = userRepository.findById(id).orElseThrow();

        user.setEnabled(!user.isEnabled());

        userRepository.save(user);

        redirectAttributes.addFlashAttribute("success",
                "User status updated!");

        return "redirect:/users/manage";
    }

    @PostMapping("/change-password")
    @ResponseBody
    public ResponseEntity<?> changePassword(
            @RequestParam String currentPassword,
            @RequestParam String newPassword
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User user;

        if (authentication.getPrincipal() instanceof OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");

            user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

        } else {
            String username = authentication.getName();

            user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        // ✅ xử lý password
        if (user.getPassword() == null) {
            // Google account → set password lần đầu
            user.setPassword(passwordEncoder.encode(newPassword));
        } else {
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully");
    }
    @GetMapping("/api/users/me")
    @ResponseBody
    public UserDTO getCurrentUser(Authentication authentication) {

        User user;

        if (authentication.getPrincipal() instanceof OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");

            user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

        } else {
            String username = authentication.getName();

            user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        // ✅ map sang DTO
        UserDTO dto = new UserDTO();
        dto.fullName = user.getFullName();
        dto.gender = user.getGender();
        dto.dateOfBirth = user.getDateOfBirth() != null
                ? user.getDateOfBirth().toString()
                : "";
        dto.phoneNumber = user.getPhoneNumber();
        dto.email = user.getEmail();

        return dto;
    }
}
