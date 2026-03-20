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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class StaffController {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository; // 👈 thêm dòng này

    public StaffController(UserRepository userRepository,
            StaffRepository staffRepository) { // 👈 sửa constructor
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
            @RequestParam LocalDate hireDate,
            @RequestParam Double salary,
            RedirectAttributes redirectAttributes) {

        // validate như cũ...

        userRepository.save(user);

        Staff staff = new Staff();
        staff.setUser(user);
        staff.setHireDate(hireDate);
        staff.setSalary(salary);

        staffRepository.save(staff);

        redirectAttributes.addFlashAttribute("success",
                "Staff created successfully!");

        return "redirect:/staff/manage";
    }

    // ================= UPDATE STAFF =================
    @PostMapping("/staff/update")
    public String updateStaff(@ModelAttribute User user,
            @RequestParam LocalDate hireDate,
            @RequestParam Double salary) {

        User existing = userRepository.findById(user.getId()).orElseThrow();

        existing.setFullName(user.getFullName());
        existing.setEmail(user.getEmail());
        existing.setPhoneNumber(user.getPhoneNumber());
        existing.setGender(user.getGender());
        existing.setRole(user.getRole());

        userRepository.save(existing);

        Staff staff = staffRepository.findByUserId(existing.getId()).orElseThrow();

        staff.setHireDate(hireDate);
        staff.setSalary(salary);

        staffRepository.save(staff);

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

        staffPage.getContent().forEach(u -> {
            System.out.println("User: " + u.getFullName());
            System.out.println("Staff: " + u.getStaff());
        });

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