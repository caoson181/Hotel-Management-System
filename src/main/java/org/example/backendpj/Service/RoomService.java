package org.example.backendpj.Service;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.BookingDetail;
import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.BookingDetailRepository;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.Repository.CustomerRepository;
import org.example.backendpj.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Page<Room> search(String keyword, int page, String sortField, String sortDir) {
        int pageSize = 20;
        sortField = sortField.trim();
        sortDir = sortDir.trim();
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(
                page,
                pageSize,
                sort);

        if (keyword != null && !keyword.trim().isEmpty()) {
            return roomRepository.search(keyword, pageable);
        }

        return roomRepository.findAll(pageable);
    }

    public Room updateStatus(Integer id, String newStatus) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setStatus(newStatus);

        // Find booking linked to this room
        Optional<BookingDetail> detailOpt = bookingDetailRepository.findTopByRoomOrderByIdDesc(room);

        if (detailOpt.isPresent()) {
            Booking booking = detailOpt.get().getBooking();

            String bookingStatus = mapRoomToBookingStatus(newStatus);

            if (bookingStatus != null) {
                booking.setStatus(bookingStatus);

                if ("OCCUPIED".equals(bookingStatus)) {
                    booking.setCheckInDate(LocalDate.now());
                }

                if ("COMPLETED".equals(bookingStatus)) {
                    booking.setCheckOutDate(LocalDate.now());
                }

                bookingRepository.save(booking);
            }
        }

        return roomRepository.save(room);
    }

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public void assignRoomToCustomer(Integer roomId, String customerId) {

        // 1. Find customer
        Customer customer = customerRepository.findById(Integer.parseInt(customerId))
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // 2. Find or create booking
        Booking booking = bookingRepository
                .findTopByCustomer(customer)
                .orElseGet(() -> {
                    Booking newBooking = new Booking();
                    newBooking.setCustomer(customer);
                    newBooking.setStatus("RESERVED"); // ✅ correct
                    newBooking.setTotalAmount(BigDecimal.ZERO);
                    return bookingRepository.save(newBooking);
                });

        // 3. Find room
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 🚨 Validate
        if (!room.getStatus().equalsIgnoreCase("AVAILABLE")) {
            throw new RuntimeException("Room is not available");
        }

        // 4. Create BookingDetail (ALWAYS create new)
        BookingDetail detail = new BookingDetail();
        detail.setBooking(booking);
        detail.setRoom(room);
        detail.setPrice(room.getPrice());

        // 5. Update statuses
        room.setStatus("RESERVED");
        booking.setStatus("RESERVED");

        // 6. Save
        bookingDetailRepository.save(detail);
        roomRepository.save(room);
        bookingRepository.save(booking);
    }

    private String mapRoomToBookingStatus(String roomStatus) {
        return switch (roomStatus.toUpperCase()) {
            case "RESERVED" -> "RESERVED";
            case "OCCUPIED" -> "OCCUPIED";
            case "CHECKED-OUT" -> "COMPLETED";
            default -> null; // ignore AVAILABLE, HOUSEKEEPING
        };
    }

}
