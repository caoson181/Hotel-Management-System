package org.example.backendpj.controller;

import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.CustomerRepository;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.dto.SimpleBookingDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/bookings")
public class SimpleBookingController {

    private List<SimpleBookingDTO> bookings = new ArrayList<>();
    private final AtomicInteger bookingSequence = new AtomicInteger(1);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // ✅ CREATE booking
    @PostMapping
    public SimpleBookingDTO createBooking(@RequestBody SimpleBookingDTO booking,
                                          Principal principal) {
        booking.setBookingId(bookingSequence.getAndIncrement());

        if (principal != null) {
            String username = principal.getName();

            User user = userRepository.findByUsername(username).orElse(null);

            if (user != null) {
                Customer customer = customerRepository.findByUser(user).orElse(null);

                if (customer != null) {
                    booking.setCustomerId(customer.getCustomerId());
                }
            }
        }

        bookings.add(booking);
        return booking;
    }

    // GET bookings
    @GetMapping("/current")
    public List<SimpleBookingDTO> getBookings() {
        return bookings;
    }
}