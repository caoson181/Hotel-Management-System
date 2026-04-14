package org.example.backendpj.Service;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.BookingDetail;
import org.example.backendpj.Entity.CustomerBooking;
import org.example.backendpj.Entity.Payment;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.BookingDetailRepository;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.Repository.CustomerBookingRepository;
import org.example.backendpj.Repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class BookingLifecycleService {

    private final BookingRepository bookingRepository;
    private final CustomerBookingRepository customerBookingRepository;
    private final BookingDetailRepository bookingDetailRepository;
    private final PaymentRepository paymentRepository;
    private final WalletService walletService;
    private final DailyRevenueService dailyRevenueService;

    public BookingLifecycleService(BookingRepository bookingRepository,
                                   CustomerBookingRepository customerBookingRepository,
                                   BookingDetailRepository bookingDetailRepository,
                                   PaymentRepository paymentRepository,
                                   WalletService walletService,
                                   DailyRevenueService dailyRevenueService) {
        this.bookingRepository = bookingRepository;
        this.customerBookingRepository = customerBookingRepository;
        this.bookingDetailRepository = bookingDetailRepository;
        this.paymentRepository = paymentRepository;
        this.walletService = walletService;
        this.dailyRevenueService = dailyRevenueService;
    }

    @Transactional
    public Payment recordPayment(Booking booking, BigDecimal amount, String paymentMethod, LocalDateTime paymentDate) {
        if (booking == null || amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return null;
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentDate(paymentDate == null ? LocalDateTime.now() : paymentDate);
        payment.setStatus("SUCCESS");
        Payment savedPayment = paymentRepository.save(payment);
        dailyRevenueService.ensureRevenueForDate(savedPayment.getPaymentDate().toLocalDate());
        return savedPayment;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> buildCancellationPreview(Booking booking, LocalDate effectiveDate) {
        LocalDate previewDate = effectiveDate == null ? LocalDate.now() : effectiveDate;
        CancellationQuote quote = quoteCancellation(booking, previewDate);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("daysBeforeCheckIn", quote.daysBeforeCheckIn());
        response.put("refundRate", quote.refundRate());
        response.put("refundAmount", quote.refundAmount());
        response.put("cancellationFee", quote.cancellationFee());
        response.put("prepaid", quote.prepaid());
        return response;
    }

    @Transactional
    public Map<String, Object> cancelBookingForCustomer(Integer bookingId, User user, boolean confirmed) {
        if (!confirmed) {
            throw new RuntimeException("Please confirm the cancellation policy before cancelling");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getCustomer() == null
                || booking.getCustomer().getUser() == null
                || !Objects.equals(booking.getCustomer().getUser().getId(), user.getId())) {
            throw new RuntimeException("You do not have permission to cancel this booking");
        }

        validateCancellation(booking, LocalDate.now());

        CancellationQuote quote = quoteCancellation(booking, LocalDate.now());
        LocalDateTime now = LocalDateTime.now();

        if (quote.refundAmount().compareTo(BigDecimal.ZERO) > 0) {
            walletService.credit(user, quote.refundAmount());
            recordPayment(booking, quote.refundAmount(), "REFUND", now);
        }

        if (quote.cancellationFee().compareTo(BigDecimal.ZERO) > 0) {
            recordPayment(booking, quote.cancellationFee(), "CANCELLATIONFEE", now);
        }

        booking.setStatus("CANCELLATION");
        booking.setCancelledAt(now);
        booking.setRefundAmount(quote.refundAmount());
        booking.setCancellationFee(quote.cancellationFee());
        bookingRepository.save(booking);

        List<CustomerBooking> customerBookings = booking.getGroupCode() == null || booking.getGroupCode().isBlank()
                ? List.of()
                : customerBookingRepository.findAllByGroupCodeOrderByIdAsc(booking.getGroupCode());
        for (CustomerBooking customerBooking : customerBookings) {
            customerBooking.setBooking(booking);
        }
        customerBookingRepository.saveAll(customerBookings);

        List<BookingDetail> bookingDetails = bookingDetailRepository.findAllByBooking(booking);
        for (BookingDetail detail : bookingDetails) {
            detail.setStatus("CANCELLATION");
        }
        bookingDetailRepository.saveAll(bookingDetails);
        dailyRevenueService.ensureRevenueForDate(now.toLocalDate());

        return Map.of(
                "bookingId", booking.getId(),
                "status", booking.getStatus(),
                "refundAmount", quote.refundAmount(),
                "cancellationFee", quote.cancellationFee(),
                "refundRate", quote.refundRate()
        );
    }

    @Transactional
    public void handleEarlyCheckout(BookingDetail detail, BigDecimal previousAmount, LocalDate checkoutDate) {
        if (detail == null || detail.getBooking() == null) {
            return;
        }

        Booking booking = detail.getBooking();
        if (!isPrepaid(booking)) {
            dailyRevenueService.ensureRevenueForDate(checkoutDate);
            return;
        }

        BigDecimal oldAmount = safeAmount(previousAmount);
        BigDecimal newAmount = safeAmount(detail.getFinalAmount());
        BigDecimal refundAmount = oldAmount.subtract(newAmount);
        if (refundAmount.compareTo(BigDecimal.ZERO) <= 0) {
            dailyRevenueService.ensureRevenueForDate(checkoutDate);
            return;
        }

        User user = booking.getCustomer() != null ? booking.getCustomer().getUser() : null;
        if (user != null) {
            walletService.credit(user, refundAmount);
        }
        booking.setRefundAmount(safeAmount(booking.getRefundAmount()).add(refundAmount));
        bookingRepository.save(booking);
        recordPayment(booking, refundAmount, "REFUND", LocalDateTime.now());
        dailyRevenueService.ensureRevenueForDate(checkoutDate);
    }

    private void validateCancellation(Booking booking, LocalDate today) {
        String status = booking.getStatus() == null ? "" : booking.getStatus().trim().toUpperCase();
        if ("CANCELLATION".equals(status) || "CANCELLED".equals(status)) {
            throw new RuntimeException("This booking has already been cancelled");
        }
        if ("COMPLETED".equals(status) || "NO_SHOW".equals(status)) {
            throw new RuntimeException("This booking can no longer be cancelled");
        }
        if (booking.getCheckInDate() != null && today.isAfter(booking.getCheckInDate())) {
            throw new RuntimeException("This booking has already started. Use early checkout instead");
        }

        for (BookingDetail detail : bookingDetailRepository.findAllByBooking(booking)) {
            if (detail.getActualCheckOutDate() != null) {
                throw new RuntimeException("This booking already has checkout progress");
            }

            String roomStatus = detail.getRoom() != null && detail.getRoom().getStatus() != null
                    ? detail.getRoom().getStatus().trim().toUpperCase()
                    : "";
            if ("OCCUPIED".equals(roomStatus) || "CHECKED-OUT".equals(roomStatus) || "HOUSEKEEPING".equals(roomStatus)) {
                throw new RuntimeException("This booking is already being processed and cannot be cancelled");
            }
        }
    }

    private CancellationQuote quoteCancellation(Booking booking, LocalDate effectiveDate) {
        BigDecimal totalAmount = booking == null || booking.getTotalAmount() == null
                ? BigDecimal.ZERO
                : booking.getTotalAmount();
        boolean prepaid = isPrepaid(booking);
        long daysBeforeCheckIn = booking != null && booking.getCheckInDate() != null
                ? ChronoUnit.DAYS.between(effectiveDate, booking.getCheckInDate())
                : 0;

        BigDecimal refundRate = BigDecimal.ZERO;
        if (prepaid) {
            if (daysBeforeCheckIn >= 3) {
                refundRate = BigDecimal.ONE;
            } else if (daysBeforeCheckIn == 2) {
                refundRate = new BigDecimal("0.50");
            }
        }

        BigDecimal refundAmount = totalAmount.multiply(refundRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal cancellationFee = totalAmount.subtract(refundAmount).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
        return new CancellationQuote(daysBeforeCheckIn, refundRate, refundAmount, cancellationFee, prepaid);
    }

    private boolean isPrepaid(Booking booking) {
        return booking != null && "PAY_NOW".equalsIgnoreCase(booking.getPaymentMode());
    }

    private BigDecimal safeAmount(BigDecimal amount) {
        return amount == null ? BigDecimal.ZERO : amount;
    }

    private record CancellationQuote(long daysBeforeCheckIn,
                                     BigDecimal refundRate,
                                     BigDecimal refundAmount,
                                     BigDecimal cancellationFee,
                                     boolean prepaid) {
    }
}
