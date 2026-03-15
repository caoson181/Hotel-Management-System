package org.example.backendpj.Service;

import org.example.backendpj.Entity.EmailOtp;
import org.example.backendpj.Repository.EmailOtpRepository;
import org.springframework.beans.factory.annotation.Value;


import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.Random;

@Service
public class OtpService {
    private final EmailOtpRepository otpRepo;
    private final MailService mailService;

    @Value("${app.otp.minutes:10}")
    private int otpMinutes;

    public OtpService(EmailOtpRepository otpRepo, MailService mailService) {
        this.otpRepo = otpRepo;
        this.mailService = mailService;
    }

    public void createAndSend(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        EmailOtp row = new EmailOtp();
        row.setEmail(email);
        row.setOtpHash(sha256(otp));
        row.setExpiresAt(Instant.now().plus(otpMinutes, ChronoUnit.MINUTES));
        otpRepo.save(row);

        mailService.sendOtp(email, otp, otpMinutes);
    }

    public boolean verify(String email, String otp) {
        return otpRepo.findTopByEmailOrderByCreatedAtDesc(email)
                .filter(x -> x.getUsedAt() == null)
                .filter(x -> x.getExpiresAt().isAfter(Instant.now()))
                .filter(x -> x.getOtpHash().equals(sha256(otp)))
                .map(x -> { x.setUsedAt(Instant.now()); otpRepo.save(x); return true; })
                .orElse(false);
    }

    private static String sha256(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] dig = md.digest(s.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(dig);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}