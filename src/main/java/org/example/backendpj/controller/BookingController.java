package org.example.backendpj.controller;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.User;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.Repository.UserRepository;
import org.example.backendpj.dto.SimpleBookingDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingController(BookingRepository bookingRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }
    public User getCurrentUser() {
        return userRepository.findById(1)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    // ✅ PREVIEW (PENDING)
    @PostMapping("/preview")
    public Booking createPendingBooking(@RequestBody SimpleBookingDTO dto) {

        Booking booking = new Booking();

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

}
