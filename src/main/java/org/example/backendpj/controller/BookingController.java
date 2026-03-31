package org.example.backendpj.controller;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.Payment;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.Repository.CustomerRepository;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.Repository.PaymentRepository;

import org.example.backendpj.dto.SimpleBookingDTO;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class   BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;

    public BookingController(BookingRepository bookingRepository, UserRepository userRepository, CustomerRepository customerRepository, PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.paymentRepository = paymentRepository;
    }
    public User getCurrentUser(Authentication authentication) {

        if (authentication.getPrincipal() instanceof OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");

            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } else {
            String username = authentication.getName();

            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
    }
    // ✅ PREVIEW (PENDING)
    @PostMapping("/preview")
    public Booking createPendingBooking(@RequestBody SimpleBookingDTO dto,
                                        Authentication authentication) {
        User user = getCurrentUser(authentication);
        Customer customer = customerRepository.findByUser_Id(user.getId());
        Booking booking = new Booking();
        booking.setCustomer(customer);

        booking.setCheckInDate(dto.getCheckInTime());
        booking.setCheckOutDate(dto.getCheckOutTime());
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    // ✅ CONFIRM
    @PutMapping("/{id}/confirm")
    public Booking confirmBooking(@PathVariable Integer id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }


    @GetMapping("/{id}")
    public Booking getBooking(@PathVariable Integer id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }
    @PostMapping("/{id}/pay")
    public Payment payBooking(@PathVariable Integer id,
                              @RequestBody Map<String, String> body) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"CONFIRMED".equals(booking.getStatus())) {
            throw new RuntimeException("Must confirm first");
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(booking.getTotalAmount());
        payment.setPaymentMethod(body.get("method"));
        payment.setStatus("SUCCESS");
        payment.setPaymentDate(LocalDateTime.now());

        booking.setStatus("PAID");

        bookingRepository.save(booking);

        return paymentRepository.save(payment);
    }
}
