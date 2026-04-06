package org.example.backendpj.controller;

import org.example.backendpj.Entity.*;
import org.example.backendpj.Repository.*;
import org.example.backendpj.dto.CustomerCheckoutRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/customer-bookings")
public class CustomerBookingController {
    private final CustomerBookingRepository customerBookingRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final BookingDetailRepository bookingDetailRepository;

    public CustomerBookingController(
            CustomerBookingRepository customerBookingRepository,
            UserRepository userRepository,
            CustomerRepository customerRepository,
            RoomRepository roomRepository,
            BookingRepository bookingRepository,
            BookingDetailRepository bookingDetailRepository) {
        this.customerBookingRepository = customerBookingRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.bookingDetailRepository = bookingDetailRepository;
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

        for (CustomerCheckoutRequest.CartItem item : req.getItems()) {
            if (item == null) continue;
            if (item.getRoomType() == null || item.getRoomType().isBlank() ||
                item.getRoomRank() == null || item.getRoomRank().isBlank()) {
                throw new RuntimeException("roomType/roomRank is required");
            }

            CustomerBooking cb = new CustomerBooking();
            cb.setCustomer(customer);
            cb.setCheckIn(LocalDate.parse(item.getCheckIn()));
            cb.setCheckOut(LocalDate.parse(item.getCheckOut()));
            cb.setRoomType(item.getRoomType());
            cb.setRoomRank(item.getRoomRank());
            cb.setGroupCode(groupCode);
            cb.setStatus(paymentStatus);
            cb.setAssigned(false);
            cb.setCreatedAt(now);
            if (item.getPrice() != null) {
                cb.setPrice(BigDecimal.valueOf(item.getPrice()));
                total = total.add(cb.getPrice());
            }
            customerBookingRepository.save(cb);
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
        for (CustomerBooking cb : all) {
            String details = cb.getRoomType() + " " + cb.getRoomRank()
                    + " (" + cb.getCheckIn() + " -> " + cb.getCheckOut() + ")";
            result.add(Map.of(
                    "bookingId", cb.getId(),
                    "customerId", cb.getCustomer().getCustomerId(),
                    "groupCode", cb.getGroupCode(),
                    "details", details,
                    "status", cb.getStatus(),
                    "assigned", cb.isAssigned(),
                    "displayStatus", cb.getStatus() + "/" + (cb.isAssigned() ? "ASSIGNED" : "UNASSIGNED"),
                    "totalAmount", cb.getPrice() == null ? BigDecimal.ZERO : cb.getPrice()
            ));
        }
        return result;
    }

    @PostMapping("/groups/{groupCode}/assign")
    public Map<String, Object> assignGroup(@PathVariable String groupCode) {
        List<CustomerBooking> items = customerBookingRepository.findAllByGroupCodeOrderByIdAsc(groupCode);
        if (items.isEmpty()) throw new RuntimeException("Customer booking group not found");

        Customer customer = items.get(0).getCustomer();

        LocalDate minCheckIn = items.stream().map(CustomerBooking::getCheckIn).min(LocalDate::compareTo).orElse(items.get(0).getCheckIn());
        LocalDate maxCheckOut = items.stream().map(CustomerBooking::getCheckOut).max(LocalDate::compareTo).orElse(items.get(0).getCheckOut());

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setCheckInDate(minCheckIn);
        booking.setCheckOutDate(maxCheckOut);
        booking.setStatus("RESERVED");
        booking.setTotalAmount(BigDecimal.ZERO);
        booking = bookingRepository.save(booking);

        BigDecimal total = BigDecimal.ZERO;
        for (CustomerBooking cb : items) {
            Room room = roomRepository.findByRoomTypeAndRoomRank(cb.getRoomType(), cb.getRoomRank()).stream()
                    .filter(r -> r.getStatus() != null && r.getStatus().equalsIgnoreCase("AVAILABLE"))
                    .min(Comparator.comparing(Room::getId))
                    .orElseThrow(() -> new RuntimeException("No available room for " + cb.getRoomType() + " " + cb.getRoomRank()));

            room.setStatus("RESERVED");
            roomRepository.save(room);

            BookingDetail detail = new BookingDetail();
            detail.setBooking(booking);
            detail.setRoom(room);
            detail.setPrice(room.getPrice());
            bookingDetailRepository.save(detail);

            if (room.getPrice() != null) total = total.add(room.getPrice());
            cb.setAssigned(true);
            customerBookingRepository.save(cb);
        }

        booking.setTotalAmount(total);
        bookingRepository.save(booking);

        return Map.of(
                "bookingId", booking.getId(),
                "status", "ASSIGNED"
        );
    }
}

