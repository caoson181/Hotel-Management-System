package org.example.backendpj.controller;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.Service.OtpService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepo,
                          OtpService otpService,
                          PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
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

    // ===================== HANDLE SIGNUP =====================
    @PostMapping("/signup")
    public String register(@RequestParam String email,
                           @RequestParam String username,
                           @RequestParam String password,
                           @RequestParam String confirmPassword,
                           @RequestParam(name="fullName", required=false) String fullName,
                           @RequestParam(name="gender", required=false) String gender,
                           @RequestParam(name="phoneNumber", required=false) String phoneNumber,
                           @RequestParam(name="dateOfBirth", required=false)
                               @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateOfBirth,
                           Model model) {

        // Check existing email
        if (userRepo.existsByEmail(email)) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error", "Email đã tồn tại");
            return "signup";
        }

        // Check existing username
        if (userRepo.existsByUsername(username)) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error", "Username đã tồn tại");
            return "signup";
        }

        // Check password match
        if (!password.equals(confirmPassword)) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error", "Confirm password phải giống password");
            return "signup";
        }

        try {
            otpService.createAndSend(email);
        } catch (Exception e) {
            keepForm(model, email, username, fullName);
            model.addAttribute("error",
                    "Không gửi được OTP. Kiểm tra cấu hình Gmail/App Password hoặc thử lại.");
            return "signup";
        }
        User u = new User();
        u.setEmail(email);
        u.setUsername(username);
        u.setPassword(passwordEncoder.encode(password));
        u.setRole("USER");
        u.setEnabled(false);
        u.setFullName(fullName == null ? "" : fullName.trim());
        u.setGender((gender == null || gender.isBlank()) ? null : gender);
        u.setPhoneNumber((phoneNumber == null || phoneNumber.isBlank()) ? null : phoneNumber.trim());
        u.setDateOfBirth(dateOfBirth == null ? LocalDate.of(2000,1,1) : dateOfBirth);
        System.out.println("ABOUT TO SAVE user=" + email);
        userRepo.save(u);
        System.out.println("SAVED user id=" + u.getId());

        return "redirect:/auth/verify?email=" + java.net.URLEncoder.encode(email, java.nio.charset.StandardCharsets.UTF_8);
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
            model.addAttribute("error", "OTP sai hoặc đã hết hạn");
            return "verify-otp";
        }

        User u = userRepo.findByEmail(email).orElse(null);

        if (u == null) {
            model.addAttribute("error", "Không tìm thấy user theo email");
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

        User user = userRepo.findByEmail(email).orElse(null);

        if (user == null) {
            return "redirect:/auth/login";
        }

        user.setPassword(passwordEncoder.encode(password));
        userRepo.save(user);

        return "redirect:/auth/login?resetSuccess";
    }
}