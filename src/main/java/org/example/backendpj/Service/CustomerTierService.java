package org.example.backendpj.Service;

import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Entity.BookingDetail;
import org.example.backendpj.Repository.BookingDetailRepository;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.Repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class CustomerTierService {

    private static final BigDecimal SILVER_THRESHOLD = new BigDecimal("50000000");
    private static final BigDecimal GOLD_THRESHOLD = new BigDecimal("100000000");
    private static final BigDecimal PLATINUM_THRESHOLD = new BigDecimal("200000000");

    private final BookingRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final CustomerRepository customerRepository;

    public CustomerTierService(BookingRepository bookingRepository,
                               BookingDetailRepository bookingDetailRepository,
                               CustomerRepository customerRepository) {
        this.bookingRepository = bookingRepository;
        this.bookingDetailRepository = bookingDetailRepository;
        this.customerRepository = customerRepository;
    }

    public TierUpdateResult refreshTierForUser(User user) {
        if (user == null) {
            return TierUpdateResult.empty();
        }
        Customer customer = user.getCustomer();
        if (customer == null) {
            customer = customerRepository.findByUser(user).orElse(null);
        }
        return refreshTier(customer);
    }

    public TierUpdateResult refreshTier(Customer customer) {
        if (customer == null) {
            return TierUpdateResult.empty();
        }

        ensureDefaults(customer);

        String previousLevel = customer.getMemberLevel();
        String previousRank = customer.getCustomerRank();

        List<BookingDetail> checkedOutDetails = bookingDetailRepository
                .findAllByBooking_CustomerAndActualCheckOutDateIsNotNull(customer)
                .stream()
                .filter(this::isTierEligible)
                .toList();

        BigDecimal totalCompletedAmount = checkedOutDetails.stream()
                .map(this::resolveRecognizedAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long completedBookingCount = checkedOutDetails.size();

        Tier targetTier = resolveTier(totalCompletedAmount);
        boolean upgraded = tierScore(targetTier.memberLevel(), targetTier.customerRank())
                > tierScore(previousLevel, previousRank);

        customer.setMemberLevel(targetTier.memberLevel());
        customer.setCustomerRank(targetTier.customerRank());
        if (upgraded) {
            customer.setTierUpgradePending(true);
        }
        customerRepository.save(customer);

        return new TierUpdateResult(
                customer.getCustomerId(),
                targetTier.memberLevel(),
                targetTier.customerRank(),
                previousLevel,
                previousRank,
                totalCompletedAmount,
                completedBookingCount,
                upgraded,
                customer.isTierUpgradePending()
        );
    }

    private void ensureDefaults(Customer customer) {
        boolean changed = false;

        if (customer.getMemberLevel() == null || customer.getMemberLevel().isBlank()) {
            customer.setMemberLevel("Bronze");
            changed = true;
        }

        if (customer.getCustomerRank() == null || customer.getCustomerRank().isBlank()) {
            customer.setCustomerRank("Normal");
            changed = true;
        }

        if (customer.getCustomerId() == null || customer.getTierUpgradePending() == null) {
            customer.setTierUpgradePending(false);
            changed = true;
        }

        if (changed) {
            customerRepository.save(customer);
        }
    }

    private Tier resolveTier(BigDecimal totalCompletedAmount) {
        if (totalCompletedAmount != null && totalCompletedAmount.compareTo(PLATINUM_THRESHOLD) > 0) {
            return new Tier("Platinum", "VVIP");
        }
        if (totalCompletedAmount != null && totalCompletedAmount.compareTo(GOLD_THRESHOLD) > 0) {
            return new Tier("Gold", "VIP");
        }
        if (totalCompletedAmount != null && totalCompletedAmount.compareTo(SILVER_THRESHOLD) > 0) {
            return new Tier("Silver", "VIP");
        }
        return new Tier("Bronze", "Normal");
    }

    private int tierScore(String memberLevel, String customerRank) {
        String normalizedLevel = memberLevel == null ? "" : memberLevel.trim().toUpperCase();
        String normalizedRank = customerRank == null ? "" : customerRank.trim().toUpperCase();

        if ("PLATINUM".equals(normalizedLevel) && "VVIP".equals(normalizedRank)) {
            return 3;
        }
        if ("GOLD".equals(normalizedLevel) && "VIP".equals(normalizedRank)) {
            return 2;
        }
        if ("SILVER".equals(normalizedLevel) && "VIP".equals(normalizedRank)) {
            return 1;
        }
        return 0;
    }

    private boolean isTierEligible(BookingDetail detail) {
        return detail != null
                && (detail.getStatus() == null || !"NO_SHOW".equalsIgnoreCase(detail.getStatus()));
    }

    private BigDecimal resolveRecognizedAmount(BookingDetail detail) {
        if (detail == null) {
            return BigDecimal.ZERO;
        }
        if (detail.getFinalAmount() != null) {
            return detail.getFinalAmount();
        }
        if (detail.getPrice() == null || detail.getCheckInDate() == null) {
            return BigDecimal.ZERO;
        }

        LocalDate effectiveCheckOut = detail.getActualCheckOutDate() != null
                ? detail.getActualCheckOutDate()
                : detail.getCheckOutDate();
        long nights = effectiveCheckOut == null
                ? 1
                : Math.max(1, ChronoUnit.DAYS.between(detail.getCheckInDate(), effectiveCheckOut));
        return detail.getPrice().multiply(BigDecimal.valueOf(nights));
    }

    private record Tier(String memberLevel, String customerRank) {
    }

    public record TierUpdateResult(
            Integer customerId,
            String memberLevel,
            String customerRank,
            String previousMemberLevel,
            String previousCustomerRank,
            BigDecimal totalCompletedAmount,
            long completedBookingCount,
            boolean upgraded,
            boolean showCelebration
    ) {
        public static TierUpdateResult empty() {
            return new TierUpdateResult(null, "Bronze", "Normal", "Bronze", "Normal", BigDecimal.ZERO, 0, false, false);
        }
    }
}
