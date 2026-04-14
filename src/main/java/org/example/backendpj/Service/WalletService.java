package org.example.backendpj.Service;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Entity.Wallet;
import org.example.backendpj.Repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Locale;

@Service
public class WalletService {

    private final WalletRepository walletRepository;

    public WalletService(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    @Transactional
    public Wallet validateAndDebit(User user,
                                   String provider,
                                   String accountName,
                                   String phoneNumber,
                                   String paymentCode,
                                   BigDecimal amount) {
        validateUserInfo(user, accountName, phoneNumber);

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No wallet found for this account"));

        validateProviderCode(wallet, provider, paymentCode);

        BigDecimal currentBalance = wallet.getBalance() == null ? BigDecimal.ZERO : wallet.getBalance();
        BigDecimal requiredAmount = amount == null ? BigDecimal.ZERO : amount;
        if (currentBalance.compareTo(requiredAmount) < 0) {
            throw new RuntimeException("Wallet balance is not enough for this payment");
        }

        wallet.setBalance(currentBalance.subtract(requiredAmount));
        return walletRepository.save(wallet);
    }

    @Transactional
    public Wallet credit(User user, BigDecimal amount) {
        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("No wallet found for this account"));

        BigDecimal currentBalance = wallet.getBalance() == null ? BigDecimal.ZERO : wallet.getBalance();
        BigDecimal creditedAmount = amount == null ? BigDecimal.ZERO : amount;
        wallet.setBalance(currentBalance.add(creditedAmount));
        return walletRepository.save(wallet);
    }

    private void validateUserInfo(User user, String accountName, String phoneNumber) {
        String expectedName = normalize(user.getFullName());
        String expectedPhone = normalize(user.getPhoneNumber());
        String providedName = normalize(accountName);
        String providedPhone = normalize(phoneNumber);

        if (providedName.isBlank() || !expectedName.equalsIgnoreCase(providedName)) {
            throw new RuntimeException("Account holder invalid");
        }

        if (providedPhone.isBlank() || !expectedPhone.equals(providedPhone)) {
            throw new RuntimeException("Phone number invalid");
        }
    }

    private void validateProviderCode(Wallet wallet, String provider, String paymentCode) {
        String normalizedProvider = provider == null ? "VNPAY" : provider.trim().toUpperCase(Locale.ROOT);
        String providedCode = normalize(paymentCode);
        if (providedCode.isBlank()) {
            throw new RuntimeException(("MOMO".equals(normalizedProvider) ? "MoMo" : "VNPay") + " code is required");
        }

        String expectedCode = "MOMO".equals(normalizedProvider)
                ? normalize(wallet.getMomoCode())
                : normalize(wallet.getVnpayCode());

        if (!expectedCode.equalsIgnoreCase(providedCode)) {
            throw new RuntimeException(("MOMO".equals(normalizedProvider) ? "MoMo" : "VNPay") + " code is invalid");
        }
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().replaceAll("\\s+", " ");
    }
}
