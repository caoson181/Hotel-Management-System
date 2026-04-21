package org.example.backendpj.Service;

import jakarta.servlet.http.HttpServletRequest;
import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.CustomerBooking;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.Repository.CustomerBookingRepository;
import org.example.backendpj.Repository.PaymentRepository;
import org.example.backendpj.config.VnPayProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

@Service
public class VnPayService {

    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter VNPAY_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    private final VnPayProperties properties;
    private final BookingRepository bookingRepository;
    private final CustomerBookingRepository customerBookingRepository;
    private final PaymentRepository paymentRepository;
    private final BookingLifecycleService bookingLifecycleService;

    public VnPayService(VnPayProperties properties,
                        BookingRepository bookingRepository,
                        CustomerBookingRepository customerBookingRepository,
                        PaymentRepository paymentRepository,
                        BookingLifecycleService bookingLifecycleService) {
        this.properties = properties;
        this.bookingRepository = bookingRepository;
        this.customerBookingRepository = customerBookingRepository;
        this.paymentRepository = paymentRepository;
        this.bookingLifecycleService = bookingLifecycleService;
    }

    public String buildPaymentUrl(Booking booking, HttpServletRequest request) {
        validateConfiguration();

        String txnRef = booking.getGroupCode();
        LocalDateTime now = LocalDateTime.now(VN_ZONE);

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", properties.getVersion());
        params.put("vnp_Command", properties.getCommand());
        params.put("vnp_TmnCode", properties.getTmnCode());
        params.put("vnp_Amount", toVnPayAmount(booking.getTotalAmount()));
        params.put("vnp_CurrCode", properties.getCurrCode());
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Thanh toan don dat phong " + txnRef);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", properties.getLocale());
        params.put("vnp_ReturnUrl", properties.getReturnUrl());
        params.put("vnp_IpAddr", resolveIpAddress(request));
        params.put("vnp_CreateDate", now.format(VNPAY_DATE_FORMAT));
        params.put("vnp_ExpireDate", now.plusMinutes(15).format(VNPAY_DATE_FORMAT));

        String query = buildQuery(params, false);
        String hashData = buildQuery(params, true);
        String secureHash = hmacSha512(properties.getHashSecret(), hashData);
        return properties.getPayUrl() + "?" + query + "&vnp_SecureHash=" + secureHash;
    }

    public Map<String, String> handleCallback(Map<String, String> requestParams) {
        validateConfiguration();

        Map<String, String> params = new HashMap<>(requestParams);
        String receivedHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        String expectedHash = hmacSha512(properties.getHashSecret(), buildQuery(new TreeMap<>(params), true));
        if (!StringUtils.hasText(receivedHash) || !expectedHash.equalsIgnoreCase(receivedHash)) {
            return buildResult("invalid_signature", null, "Chu ky khong hop le");
        }

        String groupCode = params.get("vnp_TxnRef");
        Booking booking = bookingRepository.findTopByGroupCode(groupCode)
                .orElse(null);
        if (booking == null) {
            return buildResult("booking_not_found", groupCode, "Khong tim thay booking");
        }

        String responseCode = normalize(params.get("vnp_ResponseCode"));
        String transactionStatus = normalize(params.get("vnp_TransactionStatus"));
        BigDecimal paidAmount = parsePaidAmount(params.get("vnp_Amount"));
        BigDecimal bookingAmount = safeAmount(booking.getTotalAmount());

        if (paidAmount.compareTo(bookingAmount) != 0) {
            return buildResult("invalid_amount", groupCode, "So tien callback khong khop");
        }

        if ("00".equals(responseCode) && "00".equals(transactionStatus)) {
            markBookingPaid(booking, paidAmount);
            return buildResult("success", groupCode, "Thanh toan thanh cong");
        }

        return buildResult("failed", groupCode, "Thanh toan that bai");
    }

    private void markBookingPaid(Booking booking, BigDecimal paidAmount) {
        if (!paymentRepository.existsByBookingAndPaymentMethodIgnoreCaseAndStatusIgnoreCase(booking, "VNPAY", "SUCCESS")) {
            bookingLifecycleService.recordPayment(booking, paidAmount, "VNPAY", LocalDateTime.now(VN_ZONE));
        }

        List<CustomerBooking> customerBookings = booking.getGroupCode() == null || booking.getGroupCode().isBlank()
                ? List.of()
                : customerBookingRepository.findAllByGroupCodeOrderByIdAsc(booking.getGroupCode());

        for (CustomerBooking customerBooking : customerBookings) {
            customerBooking.setBooking(booking);
            customerBooking.setStatus("PAID");
        }
        customerBookingRepository.saveAll(customerBookings);
    }

    private Map<String, String> buildResult(String status, String groupCode, String message) {
        Map<String, String> result = new HashMap<>();
        result.put("status", status);
        if (groupCode != null) {
            result.put("groupCode", groupCode);
        }
        result.put("message", message);
        return result;
    }

    public String buildFrontendRedirectUrl(Map<String, String> callbackResult) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromPath("/checkout/payment")
                .queryParam("paymentStatus", callbackResult.get("status"))
                .queryParam("message", callbackResult.get("message"));

        String groupCode = callbackResult.get("groupCode");
        if (StringUtils.hasText(groupCode)) {
            builder.queryParam("groupCode", groupCode);
        }

        return builder.encode(StandardCharsets.UTF_8).build().toUriString();
    }

    private void validateConfiguration() {
        if (!StringUtils.hasText(properties.getTmnCode()) || !StringUtils.hasText(properties.getHashSecret())) {
            throw new RuntimeException("VNPay Sandbox chua duoc cau hinh tmnCode/hashSecret");
        }
    }

    private String buildQuery(Map<String, String> params, boolean encodeValues) {
        List<String> pairs = new ArrayList<>();
        params.entrySet().stream()
                .sorted(Comparator.comparing(Map.Entry::getKey))
                .forEach(entry -> {
                    if (!StringUtils.hasText(entry.getValue())) {
                        return;
                    }
                    String key = urlEncode(entry.getKey());
                    String value = encodeValues ? urlEncode(entry.getValue()) : urlEncode(entry.getValue());
                    pairs.add(key + "=" + value);
                });
        return String.join("&", pairs);
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private String hmacSha512(String secret, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder(bytes.length * 2);
            for (byte aByte : bytes) {
                hash.append(String.format("%02x", aByte));
            }
            return hash.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Khong the tao VNPay checksum", ex);
        }
    }

    private String toVnPayAmount(BigDecimal amount) {
        BigDecimal normalizedAmount = safeAmount(amount).multiply(BigDecimal.valueOf(100));
        return normalizedAmount.setScale(0, RoundingMode.HALF_UP).toPlainString();
    }

    private BigDecimal parsePaidAmount(String rawAmount) {
        if (!StringUtils.hasText(rawAmount)) {
            return BigDecimal.ZERO;
        }
        return new BigDecimal(rawAmount).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal safeAmount(BigDecimal amount) {
        return amount == null ? BigDecimal.ZERO : amount;
    }

    private String resolveIpAddress(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (StringUtils.hasText(realIp)) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }
}
