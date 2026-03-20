package org.example.backendpj.controller;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.UserRepository;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}