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

    @Transactional(readOnly = true)
    public Map<String, Object> buildDetailCancellationPreview(BookingDetail detail, LocalDate effectiveDate) {
        LocalDate previewDate = effectiveDate == null ? LocalDate.now() : effectiveDate;
        CancellationQuote quote = quoteDetailCancellation(detail, previewDate);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("daysBeforeCheckIn", quote.daysBeforeCheckIn());
        response.put("refundRate", quote.refundRate());
        response.put("refundAmount", quote.refundAmount());
        response.put("cancellationFee", quote.cancellationFee());
        response.put("prepaid", quote.prepaid());
        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> buildPendingCustomerBookingCancellationPreview(CustomerBooking customerBooking, LocalDate effectiveDate) {
        LocalDate previewDate = effectiveDate == null ? LocalDate.now() : effectiveDate;
        CancellationQuote quote = quotePendingCustomerBookingCancellation(
                customerBooking,
                customerBooking != null ? customerBooking.getBooking() : null,
                previewDate);

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
            customerBooking.setStatus(toCancelledCustomerBookingStatus(customerBooking.getStatus()));
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
    public Map<String, Object> cancelBookingDetailForCustomer(Integer detailId, User user, boolean confirmed) {
        if (!confirmed) {
            throw new RuntimeException("Please confirm the cancellation policy before cancelling");
        }

        BookingDetail detail = bookingDetailRepository.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Booking detail not found"));
        Booking booking = detail.getBooking();
        if (booking == null) {
            throw new RuntimeException("Parent booking not found");
        }

        if (booking.getCustomer() == null
                || booking.getCustomer().getUser() == null
                || !Objects.equals(booking.getCustomer().getUser().getId(), user.getId())) {
            throw new RuntimeException("You do not have permission to cancel this room");
        }

        validateDetailCancellation(detail, LocalDate.now());

        CancellationQuote quote = quoteDetailCancellation(detail, LocalDate.now());
        LocalDateTime now = LocalDateTime.now();

        if (quote.refundAmount().compareTo(BigDecimal.ZERO) > 0) {
            walletService.credit(user, quote.refundAmount());
            recordPayment(booking, quote.refundAmount(), "REFUND", now);
        }

        if (quote.cancellationFee().compareTo(BigDecimal.ZERO) > 0) {
            recordPayment(booking, quote.cancellationFee(), "CANCELLATIONFEE", now);
        }

        detail.setStatus("CANCELLATION");
        detail.setFinalAmount(BigDecimal.ZERO);
        bookingDetailRepository.save(detail);

        booking.setRefundAmount(safeAmount(booking.getRefundAmount()).add(quote.refundAmount()));
        booking.setCancellationFee(safeAmount(booking.getCancellationFee()).add(quote.cancellationFee()));
        syncBookingSummary(booking);
        bookingRepository.save(booking);
        dailyRevenueService.ensureRevenueForDate(now.toLocalDate());

        return Map.of(
                "bookingId", booking.getId(),
                "detailId", detail.getId(),
                "status", detail.getStatus(),
                "refundAmount", quote.refundAmount(),
                "cancellationFee", quote.cancellationFee(),
                "refundRate", quote.refundRate()
        );
    }

    @Transactional
    public Map<String, Object> cancelCustomerBookingForCustomer(Integer customerBookingId, User user, boolean confirmed) {
        if (!confirmed) {
            throw new RuntimeException("Please confirm the cancellation policy before cancelling");
        }

        CustomerBooking customerBooking = customerBookingRepository.findById(customerBookingId)
                .orElseThrow(() -> new RuntimeException("Customer booking not found"));
        Booking booking = customerBooking.getBooking();
        if (booking == null) {
            throw new RuntimeException("Parent booking not found");
        }

        if (customerBooking.getCustomer() == null
                || customerBooking.getCustomer().getUser() == null
                || !Objects.equals(customerBooking.getCustomer().getUser().getId(), user.getId())) {
            throw new RuntimeException("You do not have permission to cancel this room");
        }

        validatePendingCustomerBookingCancellation(customerBooking, LocalDate.now());

        CancellationQuote quote = quotePendingCustomerBookingCancellation(customerBooking, booking, LocalDate.now());
        LocalDateTime now = LocalDateTime.now();

        if (quote.refundAmount().compareTo(BigDecimal.ZERO) > 0) {
            walletService.credit(user, quote.refundAmount());
            recordPayment(booking, quote.refundAmount(), "REFUND", now);
        }

        if (quote.cancellationFee().compareTo(BigDecimal.ZERO) > 0) {
            recordPayment(booking, quote.cancellationFee(), "CANCELLATIONFEE", now);
        }

        customerBooking.setStatus(extractPaymentState(customerBooking.getStatus()) + "_CANCELLATION");
        customerBookingRepository.save(customerBooking);

        booking.setRefundAmount(safeAmount(booking.getRefundAmount()).add(quote.refundAmount()));
        booking.setCancellationFee(safeAmount(booking.getCancellationFee()).add(quote.cancellationFee()));
        syncBookingSummary(booking);
        bookingRepository.save(booking);
        dailyRevenueService.ensureRevenueForDate(now.toLocalDate());

        return Map.of(
                "bookingId", booking.getId(),
                "customerBookingId", customerBooking.getId(),
                "status", customerBooking.getStatus(),
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
        if ("CANCELLATION".equals(status)) {
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

    private void validateDetailCancellation(BookingDetail detail, LocalDate today) {
        String status = detail.getStatus() == null ? "" : detail.getStatus().trim().toUpperCase();
        if ("CANCELLATION".equals(status)) {
            throw new RuntimeException("This room has already been cancelled");
        }
        if ("NO_SHOW".equals(status) || detail.getActualCheckOutDate() != null) {
            throw new RuntimeException("This room can no longer be cancelled");
        }
        if (detail.getCheckInDate() != null && today.isAfter(detail.getCheckInDate())) {
            throw new RuntimeException("This room has already started. Use early checkout instead");
        }

        String roomStatus = detail.getRoom() != null && detail.getRoom().getStatus() != null
                ? detail.getRoom().getStatus().trim().toUpperCase()
                : "";
        if ("OCCUPIED".equals(roomStatus) || "CHECKED-OUT".equals(roomStatus) || "HOUSEKEEPING".equals(roomStatus)) {
            throw new RuntimeException("This room is already being processed and cannot be cancelled");
        }
    }

    private void validatePendingCustomerBookingCancellation(CustomerBooking customerBooking, LocalDate today) {
        String status = customerBooking.getStatus() == null ? "" : customerBooking.getStatus().trim().toUpperCase();
        if (status.contains("CANCELLATION")) {
            throw new RuntimeException("This room has already been cancelled");
        }
        if (customerBooking.isAssigned()) {
            throw new RuntimeException("This room has already been assigned. Cancel the assigned room detail instead");
        }
        if (customerBooking.getCheckIn() != null && today.isAfter(customerBooking.getCheckIn())) {
            throw new RuntimeException("This room has already started. Use early checkout instead");
        }
    }

    private CancellationQuote quoteCancellation(Booking booking, LocalDate effectiveDate) {
        BigDecimal totalAmount = booking == null || booking.getTotalAmount() == null
                ? BigDecimal.ZERO
                : booking.getTotalAmount();
        boolean prepaid = isPrepaid(booking);
        LocalDate checkInDate = booking != null ? booking.getCheckInDate() : null;
        return quoteCancellationForAmount(totalAmount, checkInDate, prepaid, effectiveDate);
    }

    private CancellationQuote quoteDetailCancellation(BookingDetail detail, LocalDate effectiveDate) {
        Booking booking = detail == null ? null : detail.getBooking();
        BigDecimal lineAmount = detail == null
                ? BigDecimal.ZERO
                : safeAmount(detail.getFinalAmount() != null ? detail.getFinalAmount() : detail.getPrice());
        LocalDate checkInDate = detail != null ? detail.getCheckInDate() : null;
        return quoteCancellationForAmount(lineAmount, checkInDate, isPrepaid(booking), effectiveDate);
    }

    private CancellationQuote quotePendingCustomerBookingCancellation(CustomerBooking customerBooking,
                                                                      Booking booking,
                                                                      LocalDate effectiveDate) {
        BigDecimal lineAmount = customerBooking == null ? BigDecimal.ZERO : safeAmount(customerBooking.getPrice());
        LocalDate checkInDate = customerBooking != null ? customerBooking.getCheckIn() : null;
        return quoteCancellationForAmount(lineAmount, checkInDate, isPrepaid(booking), effectiveDate);
    }

    private CancellationQuote quoteCancellationForAmount(BigDecimal amount,
                                                         LocalDate checkInDate,
                                                         boolean prepaid,
                                                         LocalDate effectiveDate) {
        long daysBeforeCheckIn = checkInDate != null
                ? ChronoUnit.DAYS.between(effectiveDate, checkInDate)
                : 0;

        BigDecimal refundRate = BigDecimal.ZERO;
        if (prepaid) {
            if (daysBeforeCheckIn >= 3) {
                refundRate = BigDecimal.ONE;
            } else if (daysBeforeCheckIn == 2) {
                refundRate = new BigDecimal("0.50");
            }
        }

        BigDecimal baseAmount = safeAmount(amount);
        BigDecimal refundAmount = baseAmount.multiply(refundRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal cancellationFee = baseAmount.subtract(refundAmount).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);
        return new CancellationQuote(daysBeforeCheckIn, refundRate, refundAmount, cancellationFee, prepaid);
    }

    private boolean isPrepaid(Booking booking) {
        return booking != null && "PAY_NOW".equalsIgnoreCase(booking.getPaymentMode());
    }

    private BigDecimal safeAmount(BigDecimal amount) {
        return amount == null ? BigDecimal.ZERO : amount;
    }

    private void syncBookingSummary(Booking booking) {
        List<BookingDetail> allDetails = bookingDetailRepository.findAllByBooking(booking);
        List<BookingDetail> activeDetails = allDetails.stream()
                .filter(detail -> !isCancelled(detail))
                .toList();
        List<CustomerBooking> pendingCustomerBookings = getActivePendingCustomerBookings(booking);

        if (activeDetails.isEmpty() && pendingCustomerBookings.isEmpty()) {
            if (allDetails.isEmpty()) {
                booking.setCheckInDate(null);
                booking.setCheckOutDate(null);
                booking.setTotalAmount(BigDecimal.ZERO);
                booking.setStatus("PENDING");
                return;
            }

            booking.setCheckInDate(allDetails.stream()
                    .map(BookingDetail::getCheckInDate)
                    .filter(Objects::nonNull)
                    .min(LocalDate::compareTo)
                    .orElse(null));
            booking.setCheckOutDate(allDetails.stream()
                    .map(this::getEffectiveCheckOutDate)
                    .filter(Objects::nonNull)
                    .max(LocalDate::compareTo)
                    .orElse(null));
            booking.setTotalAmount(BigDecimal.ZERO);
            booking.setStatus("CANCELLATION");
            if (booking.getCancelledAt() == null) {
                booking.setCancelledAt(LocalDateTime.now());
            }
            return;
        }

        booking.setCheckInDate(java.util.stream.Stream.concat(
                        activeDetails.stream().map(BookingDetail::getCheckInDate),
                        pendingCustomerBookings.stream().map(CustomerBooking::getCheckIn))
                .filter(Objects::nonNull)
                .min(LocalDate::compareTo)
                .orElse(null));
        booking.setCheckOutDate(java.util.stream.Stream.concat(
                        activeDetails.stream().map(this::getEffectiveCheckOutDate),
                        pendingCustomerBookings.stream().map(CustomerBooking::getCheckOut))
                .filter(Objects::nonNull)
                .max(LocalDate::compareTo)
                .orElse(null));
        booking.setTotalAmount(java.util.stream.Stream.concat(
                        activeDetails.stream()
                                .map(detail -> safeAmount(detail.getFinalAmount() != null ? detail.getFinalAmount() : detail.getPrice())),
                        pendingCustomerBookings.stream()
                                .map(customerBooking -> safeAmount(customerBooking.getPrice())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        String nextStatus = calculateBookingStatus(booking, activeDetails, pendingCustomerBookings);
        booking.setStatus(nextStatus);
        if ("CANCELLATION".equalsIgnoreCase(nextStatus) && booking.getCancelledAt() == null) {
            booking.setCancelledAt(LocalDateTime.now());
        }
    }

    private String calculateBookingStatus(Booking booking,
                                          List<BookingDetail> details,
                                          List<CustomerBooking> pendingCustomerBookings) {
        if (details.isEmpty() && pendingCustomerBookings.isEmpty()) {
            return "CANCELLATION";
        }

        LocalDate today = LocalDate.now();
        boolean hasActiveToday = false;
        boolean hasOccupiedToday = false;
        boolean hasOperationalProgress = hasOperationalProgress(details);
        boolean allNoShow = !details.isEmpty()
                && pendingCustomerBookings.isEmpty()
                && details.stream().allMatch(detail -> "NO_SHOW".equalsIgnoreCase(detail.getStatus()));
        LocalDate maxCheckOut = java.util.stream.Stream.concat(
                        details.stream().map(this::getEffectiveCheckOutDate),
                        pendingCustomerBookings.stream().map(CustomerBooking::getCheckOut))
                .filter(Objects::nonNull)
                .max(LocalDate::compareTo)
                .orElse(null);
        LocalDate minCheckIn = java.util.stream.Stream.concat(
                        details.stream().map(BookingDetail::getCheckInDate),
                        pendingCustomerBookings.stream().map(CustomerBooking::getCheckIn))
                .filter(Objects::nonNull)
                .min(LocalDate::compareTo)
                .orElse(null);
        String previousStatus = booking.getStatus() == null ? "" : booking.getStatus().trim().toUpperCase();

        for (BookingDetail detail : details) {
            if ("NO_SHOW".equalsIgnoreCase(detail.getStatus())) {
                continue;
            }
            String roomStatus = detail.getRoom() != null ? detail.getRoom().getStatus() : null;
            LocalDate effectiveCheckOut = getEffectiveCheckOutDate(detail);
            if (detail.getCheckInDate() != null && effectiveCheckOut != null
                    && !today.isBefore(detail.getCheckInDate())
                    && today.isBefore(effectiveCheckOut)) {
                hasActiveToday = true;
                if (roomStatus != null && "OCCUPIED".equalsIgnoreCase(roomStatus)) {
                    hasOccupiedToday = true;
                }
            }
        }

        if (hasOccupiedToday) {
            return "OCCUPIED";
        }
        if (allNoShow) {
            return "NO_SHOW";
        }
        if (!pendingCustomerBookings.isEmpty() && minCheckIn != null && today.isBefore(minCheckIn)) {
            return "RESERVED";
        }
        if (hasActiveToday) {
            return "RESERVED";
        }
        if (maxCheckOut != null && !today.isBefore(maxCheckOut)) {
            if (hasOperationalProgress
                    || "OCCUPIED".equals(previousStatus)
                    || "CHECKED-OUT".equals(previousStatus)
                    || "COMPLETED".equals(previousStatus)) {
                return "COMPLETED";
            }
            return "NO_SHOW";
        }
        if (minCheckIn != null && today.isBefore(minCheckIn)) {
            return "RESERVED";
        }
        return "RESERVED";
    }

    private boolean hasOperationalProgress(List<BookingDetail> details) {
        for (BookingDetail detail : details) {
            if ("NO_SHOW".equalsIgnoreCase(detail.getStatus()) || isCancelled(detail)) {
                continue;
            }
            String roomStatus = detail.getRoom() != null ? detail.getRoom().getStatus() : null;
            if (roomStatus != null && (
                    "OCCUPIED".equalsIgnoreCase(roomStatus)
                            || "CHECKED-OUT".equalsIgnoreCase(roomStatus)
                            || "HOUSEKEEPING".equalsIgnoreCase(roomStatus))) {
                return true;
            }
        }
        return false;
    }

    private LocalDate getEffectiveCheckOutDate(BookingDetail detail) {
        return detail.getActualCheckOutDate() != null ? detail.getActualCheckOutDate() : detail.getCheckOutDate();
    }

    private boolean isCancelled(BookingDetail detail) {
        String status = detail == null || detail.getStatus() == null ? "" : detail.getStatus().trim().toUpperCase();
        return "CANCELLATION".equals(status);
    }

    private List<CustomerBooking> getActivePendingCustomerBookings(Booking booking) {
        if (booking == null || booking.getGroupCode() == null || booking.getGroupCode().isBlank()) {
            return List.of();
        }

        return customerBookingRepository.findAllByGroupCodeOrderByIdAsc(booking.getGroupCode()).stream()
                .filter(customerBooking -> customerBooking.getBooking() != null
                        && Objects.equals(customerBooking.getBooking().getId(), booking.getId()))
                .filter(customerBooking -> !customerBooking.isAssigned())
                .filter(customerBooking -> customerBooking.getStatus() == null
                        || !customerBooking.getStatus().toUpperCase().contains("CANCELLATION"))
                .toList();
    }

    private String extractPaymentState(String status) {
        String normalized = status == null ? "" : status.trim().toUpperCase();
        if (normalized.startsWith("PAID")) {
            return "PAID";
        }
        return "UNPAID";
    }

    private String toCancelledCustomerBookingStatus(String status) {
        return extractPaymentState(status) + "_CANCELLATION";
    }

    private record CancellationQuote(long daysBeforeCheckIn,
                                     BigDecimal refundRate,
                                     BigDecimal refundAmount,
                                     BigDecimal cancellationFee,
                                     boolean prepaid) {
    }
}
