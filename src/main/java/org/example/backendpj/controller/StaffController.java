package org.example.backendpj.controller;

import java.time.LocalDate;

import org.example.backendpj.Entity.Staff;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.StaffRepository;
import org.example.backendpj.Repository.UserRepository;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class StaffController {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;

    public StaffController(UserRepository userRepository,
            StaffRepository staffRepository) {
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
    }

    // ================= VIEW STAFF =================
    @GetMapping("/staff/view")
    public String viewStaff(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String role,
            Model model) {

        return loadStaffPage(keyword, page, role, model, "pages/staff/view-staff");
    }

    @GetMapping("/staff/manage")
    public String manageStaff(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String role,
            Model model) {

        return loadStaffPage(keyword, page, role, model, "pages/staff/manage-staff");
    }

    // ================= CREATE STAFF =================
    @PostMapping("/staff/create")
    public String createStaff(@ModelAttribute User user,
            @RequestParam(required = false) String hireDate,
            @RequestParam(required = false) Double salary,
            RedirectAttributes redirectAttributes) {

        if (userRepository.existsByUsername(user.getUsername())) {
            redirectAttributes.addFlashAttribute("error", "Username already exists!");
            return "redirect:/staff/manage";
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            redirectAttributes.addFlashAttribute("error", "Email already exists!");
            return "redirect:/staff/manage";
        }

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("Receptionist");
        }

        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword("123");
        }

        // 👉 Save user
        User savedUser = userRepository.save(user);

        // 👉 Save staff
        if (hireDate != null && salary != null) {
            Staff staff = new Staff();
            staff.setUser(savedUser);
            staff.setHireDate(LocalDate.parse(hireDate));
            staff.setSalary(salary);

            staffRepository.save(staff);
        }

        redirectAttributes.addFlashAttribute("success", "Staff created successfully!");

        return "redirect:/staff/manage";
    }

    // ================= UPDATE STAFF =================
    @PostMapping("/staff/update")
    public String updateStaff(@ModelAttribute User user,
            @RequestParam(required = false) String hireDate,
            @RequestParam(required = false) Double salary,
            Model model,
            RedirectAttributes redirectAttributes) {

        User existing = userRepository.findById(user.getId()).orElseThrow();

        // ===== LOAD PAGE DATA =====
        loadStaffPage("", 0, null, model, "pages/staff/manage-staff");

        // ===== CHECK DUPLICATE USERNAME =====
        if (!existing.getUsername().equals(user.getUsername()) &&
                userRepository.existsByUsername(user.getUsername())) {

            model.addAttribute("error", "Username already exists!");
            return "pages/staff/manage-staff";
        }

        // ===== CHECK DUPLICATE EMAIL =====
        if (!existing.getEmail().equals(user.getEmail()) &&
                userRepository.existsByEmail(user.getEmail())) {

            model.addAttribute("error", "Email already exists!");
            return "pages/staff/manage-staff";
        }

        String currentLogin = SecurityContextHolder.getContext().getAuthentication().getName();
        String oldUsername = existing.getUsername();

        // ===== UPDATE USER =====
        existing.setUsername(user.getUsername());
        existing.setFullName(user.getFullName());
        existing.setEmail(user.getEmail());
        existing.setPhoneNumber(user.getPhoneNumber());
        existing.setGender(user.getGender());
        existing.setRole(user.getRole());

        userRepository.save(existing);

        // ===== UPDATE STAFF =====
        if (hireDate != null && salary != null) {

            Staff staff = staffRepository.findByUserId(existing.getId())
                    .orElse(new Staff());

            staff.setUser(existing);
            staff.setHireDate(LocalDate.parse(hireDate));
            staff.setSalary(salary);

            staffRepository.save(staff);
        }

        // ===== UPDATE SESSION =====
        if (currentLogin.equals(oldUsername)) {

            UsernamePasswordAuthenticationToken newAuth = new UsernamePasswordAuthenticationToken(
                    existing.getUsername(),
                    existing.getPassword(),
                    SecurityContextHolder.getContext().getAuthentication().getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(newAuth);
        }

        redirectAttributes.addFlashAttribute("success", "Staff updated successfully!");
        return "redirect:/staff/manage";
    }

    // ================= DELETE STAFF =================
    @GetMapping("/staff/delete/{id}")
    public String deleteStaff(@PathVariable Integer id) {

        userRepository.deleteById(id);

        return "redirect:/staff/manage";
    }

    @GetMapping("/staff/edit/{id}")
    public String editStaff(@PathVariable Integer id, Model model) {

        User staff = userRepository.findById(id).orElse(null);

        model.addAttribute("staff", staff);

        return "pages/staff/edit-staff";
    }

    @GetMapping("/staff/toggle/{id}")
    public String toggleStaff(@PathVariable Integer id,
            RedirectAttributes redirectAttributes) {

        User staff = userRepository.findById(id).orElseThrow();

        staff.setEnabled(!staff.isEnabled());

        userRepository.save(staff);

        redirectAttributes.addFlashAttribute("success",
                "Staff account status updated!");

        return "redirect:/staff/manage";
    }

    // ================= HELPER METHOD =================
    private String loadStaffPage(String keyword, int page, String role, Model model, String viewName) {

        Page<User> staffPage;

        if (role != null && !role.isEmpty()) {

            if (keyword.isEmpty()) {
                staffPage = userRepository.findByRole(role, PageRequest.of(page, 10));
            } else {
                staffPage = userRepository
                        .findByFullNameContainingIgnoreCaseAndRole(keyword, role, PageRequest.of(page, 10));
            }

        } else {

            if (keyword.isEmpty()) {
                staffPage = userRepository.findByRoleNot("Customer", PageRequest.of(page, 10));
            } else {
                staffPage = userRepository
                        .findByFullNameContainingIgnoreCaseAndRoleNot(keyword, "Customer", PageRequest.of(page, 10));
            }
        }

        // ====== DATA TABLE ======
        model.addAttribute("staffList", staffPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", staffPage.getTotalPages());
        model.addAttribute("keyword", keyword);
        model.addAttribute("role", role);

        // ====== DASHBOARD COUNT ======
        model.addAttribute("totalStaff", userRepository.countByRoleNot("Customer"));
        model.addAttribute("totalManager", userRepository.countByRole("Manager"));
        model.addAttribute("totalAdmin", userRepository.countByRole("Admin"));
        model.addAttribute("totalReceptionist", userRepository.countByRole("Receptionist"));
        model.addAttribute("totalHousekeeper", userRepository.countByRole("Housekeeper"));

        return viewName;
    }
}