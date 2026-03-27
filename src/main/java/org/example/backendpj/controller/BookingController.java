package org.example.backendpj.controller;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.dto.SimpleBookingDTO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // ✅ PREVIEW (PENDING)
    @PostMapping("/preview")
    public Booking createPendingBooking(@RequestBody SimpleBookingDTO dto) {

        Booking booking = new Booking();

        booking.setCheckInDate(dto.getCheckIn());
        booking.setCheckOutDate(dto.getCheckOut());
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
