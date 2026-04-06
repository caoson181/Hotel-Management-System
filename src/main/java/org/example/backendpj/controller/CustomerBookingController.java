package org.example.backendpj.controller;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.CustomerBooking;
import org.example.backendpj.Entity.Payment;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.Repository.CustomerBookingRepository;
import org.example.backendpj.Repository.CustomerRepository;
import org.example.backendpj.Repository.PaymentRepository;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.Service.RoomService;
import org.example.backendpj.dto.CustomerCheckoutRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer-bookings")
public class CustomerBookingController {
    private final CustomerBookingRepository customerBookingRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final RoomService roomService;

    public CustomerBookingController(
            CustomerBookingRepository customerBookingRepository,
            UserRepository userRepository,
            CustomerRepository customerRepository,
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository,
            RoomService roomService) {
        this.customerBookingRepository = customerBookingRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.roomService = roomService;
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication.getPrincipal() instanceof OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");
            return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/checkout")
    public Map<String, Object> checkout(@RequestBody CustomerCheckoutRequest req, Authentication authentication) {
        if (req == null || req.getItems() == null || req.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        String payMode = req.getPayMode() == null ? "PAY_LATER" : req.getPayMode().trim().toUpperCase();
        String paymentStatus = "PAY_NOW".equals(payMode) ? "PAID" : "UNPAID";

        User user = getCurrentUser(authentication);
        Customer customer = customerRepository.findByUser_Id(user.getId());

        String groupCode = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime now = LocalDateTime.now();
        BigDecimal total = BigDecimal.ZERO;
        List<CustomerBooking> createdBookings = new ArrayList<>();

        for (CustomerCheckoutRequest.CartItem item : req.getItems()) {
            if (item == null) {
                continue;
            }
            if (item.getRoomType() == null || item.getRoomType().isBlank() ||
                    item.getRoomRank() == null || item.getRoomRank().isBlank()) {
                throw new RuntimeException("roomType/roomRank is required");
            }

            LocalDate checkIn = LocalDate.parse(item.getCheckIn());
            LocalDate checkOut = LocalDate.parse(item.getCheckOut());
            if (checkIn.isBefore(LocalDate.now())) {
                throw new RuntimeException("Check-in date cannot be in the past");
            }
            Map<String, Object> availability = roomService.getAvailabilitySummary(item.getRoomType(), item.getRoomRank(), checkIn, checkOut);
            Number availableCount = (Number) availability.get("availableCount");
            if (availableCount == null || availableCount.longValue() <= 0) {
                throw new RuntimeException("No available room for " + item.getRoomType() + " " + item.getRoomRank()
                        + " in " + checkIn + " -> " + checkOut);
            }

            CustomerBooking customerBooking = new CustomerBooking();
            customerBooking.setCustomer(customer);
            customerBooking.setCheckIn(checkIn);
            customerBooking.setCheckOut(checkOut);
            customerBooking.setRoomType(item.getRoomType());
            customerBooking.setRoomRank(item.getRoomRank());
            customerBooking.setGroupCode(groupCode);
            customerBooking.setStatus(paymentStatus);
            customerBooking.setAssigned(false);
            customerBooking.setCreatedAt(now);
            if (item.getPrice() != null) {
                customerBooking.setPrice(BigDecimal.valueOf(item.getPrice()));
                total = total.add(customerBooking.getPrice());
            }
            customerBookingRepository.save(customerBooking);
            createdBookings.add(customerBooking);
        }

        if ("PAY_NOW".equals(payMode)) {
            BigDecimal finalTotal = total;
            LocalDate minCheckIn = createdBookings.stream()
                    .map(CustomerBooking::getCheckIn)
                    .min(LocalDate::compareTo)
                    .orElse(null);
            LocalDate maxCheckOut = createdBookings.stream()
                    .map(CustomerBooking::getCheckOut)
                    .max(LocalDate::compareTo)
                    .orElse(null);

            Booking booking = bookingRepository.findTopByGroupCode(groupCode)
                    .orElseGet(() -> {
                        Booking newBooking = new Booking();
                        newBooking.setCustomer(customer);
                        newBooking.setGroupCode(groupCode);
                        newBooking.setCheckInDate(minCheckIn);
                        newBooking.setCheckOutDate(maxCheckOut);
                        newBooking.setStatus("PENDING");
                        newBooking.setTotalAmount(finalTotal);
                        return bookingRepository.save(newBooking);
                    });

            for (CustomerBooking customerBooking : createdBookings) {
                customerBooking.setBooking(booking);
            }
            customerBookingRepository.saveAll(createdBookings);

            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setAmount(total);
            payment.setPaymentMethod(
                    req.getPaymentMethod() == null || req.getPaymentMethod().isBlank()
                            ? "VNPAY"
                            : req.getPaymentMethod().trim().toUpperCase()
            );
            payment.setPaymentDate(now);
            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);
        }

        return Map.of(
                "groupCode", groupCode,
                "status", paymentStatus,
                "totalAmount", total
        );
    }

    @GetMapping("/groups")
    public List<Map<String, Object>> listGroups() {
        List<CustomerBooking> all = customerBookingRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = new ArrayList<>();
        for (CustomerBooking customerBooking : all) {
            String details = customerBooking.getRoomType() + " " + customerBooking.getRoomRank()
                    + " (" + customerBooking.getCheckIn() + " -> " + customerBooking.getCheckOut() + ")";
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("bookingId", customerBooking.getId());
            row.put("customerId", customerBooking.getCustomer().getCustomerId());
            row.put("groupCode", customerBooking.getGroupCode());
            row.put("details", details);
            row.put("status", customerBooking.getStatus());
            row.put("assigned", customerBooking.isAssigned());
            row.put("displayStatus", customerBooking.getStatus() + "/" + (customerBooking.isAssigned() ? "ASSIGNED" : "UNASSIGNED"));
            row.put("totalAmount", customerBooking.getPrice() == null ? BigDecimal.ZERO : customerBooking.getPrice());
            row.put("checkIn", customerBooking.getCheckIn());
            row.put("checkOut", customerBooking.getCheckOut());
            row.put("roomType", customerBooking.getRoomType());
            row.put("roomRank", customerBooking.getRoomRank());
            row.put("roomNumber", customerBooking.getAssignedRoom() != null ? customerBooking.getAssignedRoom().getRoomNumber() : null);
            result.add(row);
        }
        return result;
    }

    @PostMapping("/groups/{groupCode}/assign")
    public Map<String, Object> assignGroup(@PathVariable String groupCode) {
        return roomService.assignGroupBookings(groupCode);
    }
}
