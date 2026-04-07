package org.example.backendpj.controller;

import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.CustomerRepository;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.Service.OtpService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.time.LocalDate;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;

    public AuthController(UserRepository userRepo,
            OtpService otpService,
            PasswordEncoder passwordEncoder,
            CustomerRepository customerRepository) {
        this.userRepo = userRepo;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
        this.customerRepository = customerRepository;
    }

    // ===================== SIGNUP PAGE =====================
    @GetMapping("/signup")
    public String registerPage() {
        return "signup";
    }

    private void keepForm(Model model, String email, String username, String fullName) {
        model.addAttribute("email", email);
        model.addAttribute("username", username);
        model.addAttribute("fullName", fullName);
    }

    private boolean isValidPassword(String password) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$";
        return password.matches(regex);
    }

    private boolean isValidFullname(String fullName) {
        if (fullName == null || fullName.isBlank())
            return false;
        String regex = "^[a-zA-Z\\s\\p{L}]+$";
        return fullName.matches(regex);
    }

    private boolean isOldEnough(LocalDate dateOfBirth) {
        if (dateOfBirth == null)
            return false;
        LocalDate today = LocalDate.now();
        // 1. Không được là ngày ở tương lai
        if (dateOfBirth.isAfter(today))
            return false;
        // 2. Phải đủ 18 năm tính đến hôm nay
        return !dateOfBirth.plusYears(18).isAfter(today);
    }

    // ===================== HANDLE SIGNUP =====================
    @PostMapping("/signup")
    public String register(@RequestParam String email,
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String confirmPassword,
            @RequestParam(name = "fullName", required = false) String fullName,
            @RequestParam(name = "gender", required = false) String gender,
            @RequestParam(name = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(name = "dateOfBirth", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
            Model model) {

        // Check existing email
        if (userRepo.existsByEmail(email)) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error", "Email is already in use");
            return "signup";
        }

        // Check existing username
        if (userRepo.existsByUsername(username)) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error", "Username is already in use");
            return "signup";
        }
        if (!isValidFullname(fullName)) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error",
                    "Fullname must only have character");
            return "signup";
        }

        if (dateOfBirth == null) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error", "Date of birth is invalid");
            return "signup";
        }

        if (dateOfBirth.isAfter(LocalDate.now())) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error", "Date of birth is invalid");
            return "signup";
        }

        if (dateOfBirth != null && (dateOfBirth.getYear() < 1000 || dateOfBirth.getYear() > 9999)) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error", "Date of birth is invalid ");
            return "signup";
        }

        if (dateOfBirth != null && !isOldEnough(dateOfBirth)) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error", "You need 18+");
            return "signup";
        }

        // Check password match
        if (!password.equals(confirmPassword)) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error", "Confirm password = password");
            return "signup";
        }
        if (!isValidPassword(password)) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error",
                    "Password must be at least 8 characters and include uppercase, lowercase and special character");
            return "signup";
        }

        try {
            otpService.createAndSend(email);
        } catch (Exception e) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error",
                    "Can't send otp. Please try again");
            return "signup";
        }
        User u = new User();
        u.setEmail(email);
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(password));
        u.setRole("Customer");
        u.setEnabled(false);
        u.setFullName(fullName == null ? "" : fullName.trim());
        u.setGender((gender == null || gender.isBlank()) ? null : gender);
        u.setPhoneNumber((phoneNumber == null || phoneNumber.isBlank()) ? null : phoneNumber.trim());
        u.setDateOfBirth(dateOfBirth == null ? LocalDate.of(2000, 1, 1) : dateOfBirth);
        System.out.println("ABOUT TO SAVE user=" + email);
        userRepo.save(u);

        Customer c = new Customer();
        c.setUser(u);
        c.setMemberLevel("Bronze");
        c.setCustomerRank("Normal");

        customerRepository.save(c);

        System.out.println("SAVED user id=" + u.getId());

        return "redirect:/auth/verify?email="
                + java.net.URLEncoder.encode(email, java.nio.charset.StandardCharsets.UTF_8);
    }
    // Create user

    // ===================== VERIFY PAGE =====================
    @GetMapping("/verify")
    public String verifyPage(@RequestParam String email, Model model) {
        model.addAttribute("email", email);
        return "verify-otp";
    }

    // ===================== HANDLE OTP =====================
    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String email,
            @RequestParam String otp,
            Model model) {

        boolean ok = otpService.verify(email, otp);

        if (!ok) {
            model.addAttribute("email", email);
            model.addAttribute("error", "OTP is wrong");
            return "verify-otp";
        }

        User u = userRepo.findByEmail(email).orElse(null);

        if (u == null) {
            model.addAttribute("error", "Can't find user by email=" + email);
            return "signup";
        }

        u.setEnabled(true);
        userRepo.save(u);

        return "redirect:/auth/login";
    }

    // ===================== LOGIN PAGE =====================
    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error,
            Model model) {

        if (error != null) {
            model.addAttribute("errorMessage", "Invalid username/email or password");
        }
        return "login";
    }
    // ===================== Forgot password =====================

    @GetMapping("/forgot-password")
    public String forgotPasswordPage() {
        return "forgot-password";
    }

    @PostMapping("/forgot-password")
    public String handleForgotPassword(@RequestParam String email,
            Model model) {

        userRepo.findByEmail(email).ifPresent(user -> {
            otpService.createAndSend(email);
        });

        // Always show same message
        model.addAttribute("message",
                "If this email exists, an OTP has been sent.");

        return "redirect:/auth/verify-reset?email=" + email;
    }

    @GetMapping("/verify-reset")
    public String verifyResetPage(@RequestParam String email, Model model) {
        model.addAttribute("email", email);
        return "verify-reset-otp";
    }

    @PostMapping("/verify-reset")
    public String handleVerifyReset(@RequestParam String email,
            @RequestParam String otp,
            Model model) {

        boolean valid = otpService.verify(email, otp);

        if (!valid) {
            model.addAttribute("email", email);
            model.addAttribute("error", "OTP invalid or expired");
            return "verify-reset-otp";
        }

        return "redirect:/auth/reset-password?email=" + email;
    }

    @GetMapping("/reset-password")
    public String resetPasswordPage(@RequestParam String email,
            Model model) {
        model.addAttribute("email", email);
        return "reset-password";
    }

    @PostMapping("/reset-password")
    public String handleResetPassword(@RequestParam String email,
            @RequestParam String password,
            @RequestParam String confirmPassword,
            Model model) {

        if (!password.equals(confirmPassword)) {
            model.addAttribute("email", email);
            model.addAttribute("error", "Passwords do not match");
            return "reset-password";
        }
        if (!isValidPassword(password)) {
            model.addAttribute("email", email);
            model.addAttribute("error",
                    "Password must be at least 8 characters and include uppercase, lowercase and special character");
            return "reset-password";
        }

        User user = userRepo.findByEmail(email).orElse(null);

        if (user == null) {
            return "redirect:/auth/login";
        }

        user.setPassword(passwordEncoder.encode(password));
        userRepo.save(user);

        return "redirect:/auth/login?resetSuccess";
    }

    @ExceptionHandler(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class)
    public String handleTypeMismatch(org.springframework.web.method.annotation.MethodArgumentTypeMismatchException ex,
            org.springframework.web.servlet.mvc.support.RedirectAttributes redirectAttributes) {
        if (ex.getName().equals("dateOfBirth")) {

            redirectAttributes.addFlashAttribute("error", "Date of Birth is invalid");
            return "redirect:/auth/signup";
        }
        return "redirect:/auth/login";
    }

    @GetMapping("/index")
    public String staffHome() {
        return "index";
    }

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/change-password")
    public String changePassword(@RequestParam String currentPassword,
            @RequestParam String newPassword,
            @RequestParam String confirmPassword,
            Principal principal,
            RedirectAttributes redirectAttributes) {

        User user = userRepository.findByUsername(principal.getName())
                .orElse(null);

        if (user == null) {
            redirectAttributes.addFlashAttribute("errorPassword", "User not found");
            return "redirect:/index";
        }

        if (!user.getPassword().equals(currentPassword)) {
            redirectAttributes.addFlashAttribute("errorPassword", "Current password is incorrect");
            return "redirect:/index";
        }

        if (!newPassword.equals(confirmPassword)) {
            redirectAttributes.addFlashAttribute("errorPassword", "Passwords do not match");
            return "redirect:/index";
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        redirectAttributes.addFlashAttribute("successPassword", "Password updated successfully");
        return "redirect:/index";
    }

}
