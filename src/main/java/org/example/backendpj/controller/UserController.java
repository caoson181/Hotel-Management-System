package org.example.backendpj.controller;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.UserRepository;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestParam;
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
            @RequestParam(defaultValue = "0") int page,
            Model model){

        Page<User> userPage;

        if(keyword.isEmpty()){
            userPage = userRepository.findByRole("Customer", PageRequest.of(page,10));
        }else{
            userPage = userRepository
                    .findByFullNameContainingIgnoreCaseAndRole(keyword,"Customer",PageRequest.of(page,10));
        }

        model.addAttribute("userList", userPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", userPage.getTotalPages());
        model.addAttribute("keyword", keyword);

        return "pages/users/manage-users";
    }

    @GetMapping("/user/toggle/{id}")
    public String toggleUser(@PathVariable Integer id,
                             RedirectAttributes redirectAttributes){

        User user = userRepository.findById(id).orElseThrow();

        user.setEnabled(!user.isEnabled());

        userRepository.save(user);

        redirectAttributes.addFlashAttribute("success",
                "User status updated!");

        return "redirect:/users/manage";
    }
}