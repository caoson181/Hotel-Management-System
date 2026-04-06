package org.example.backendpj.Service;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.BookingDetail;
import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.CustomerBooking;
import org.example.backendpj.Entity.Room;
import org.example.backendpj.Repository.BookingDetailRepository;
import org.example.backendpj.Repository.BookingRepository;
import org.example.backendpj.Repository.CustomerBookingRepository;
import org.example.backendpj.Repository.CustomerRepository;
import org.example.backendpj.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerBookingRepository customerBookingRepository;

    public Page<Room> search(String keyword, int page, String sortField, String sortDir) {
        int pageSize = 20;
        sortField = sortField.trim();
        sortDir = sortDir.trim();
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortField).descending()
                : Sort.by(sortField).ascending();

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        if (keyword != null && !keyword.trim().isEmpty()) {
            return roomRepository.search(keyword, pageable);
        }

        return roomRepository.findAll(pageable);
    }

    public Room updateStatus(Integer id, String newStatus) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setStatus(newStatus);
        room = roomRepository.save(room);

        Optional<BookingDetail> detailOpt = bookingDetailRepository.findTopByRoomOrderByIdDesc(room);

        if (detailOpt.isPresent()) {
            Booking booking = detailOpt.get().getBooking();
            syncBookingSummary(booking);
            bookingRepository.save(booking);
        }

        return room;
    }

    public void assignRoomToCustomer(Integer roomId, String customerId, String customerBookingId) {
        if (customerId == null || customerId.isBlank()) {
            throw new RuntimeException("Customer ID is required");
        }
        if (customerBookingId == null || customerBookingId.isBlank()) {
            throw new RuntimeException("Customer Booking ID is required");
        }

        Integer parsedCustomerId;
        Integer parsedCustomerBookingId;
        try {
            parsedCustomerId = Integer.parseInt(customerId.trim());
            parsedCustomerBookingId = Integer.parseInt(customerBookingId.trim());
        } catch (NumberFormatException ex) {
            throw new RuntimeException("Customer ID and Customer Booking ID must be numeric");
        }

        Customer customer = customerRepository.findById(parsedCustomerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        CustomerBooking customerBooking = customerBookingRepository.findById(parsedCustomerBookingId)
                .orElseThrow(() -> new RuntimeException("Customer booking not found"));

        if (!customer.getCustomerId().equals(customerBooking.getCustomer().getCustomerId())) {
            throw new RuntimeException("Customer ID does not match Customer Booking ID");
        }
        if (customerBooking.isAssigned()) {
            throw new RuntimeException("Customer booking is already assigned");
        }

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getStatus().equalsIgnoreCase("AVAILABLE")) {
            throw new RuntimeException("Room is not available");
        }

        Booking booking = customerBooking.getBooking();
        if (booking == null) {
            booking = findOrCreateBookingForGroup(customerBooking.getGroupCode(), customer);
        }

        BookingDetail detail = new BookingDetail();
        detail.setBooking(booking);
        detail.setRoom(room);
        detail.setPrice(room.getPrice());
        detail.setCheckInDate(customerBooking.getCheckIn());
        detail.setCheckOutDate(customerBooking.getCheckOut());

        room.setStatus("RESERVED");

        bookingDetailRepository.save(detail);
        customerBooking.setBooking(booking);
        customerBooking.setAssigned(true);

        roomRepository.save(room);
        syncBookingSummary(booking);
        bookingRepository.save(booking);
        customerBookingRepository.save(customerBooking);
    }

    private Booking findOrCreateBookingForGroup(String groupCode, Customer customer) {
        return bookingRepository.findTopByGroupCode(groupCode)
                .orElseGet(() -> {
                    Booking newBooking = new Booking();
                    newBooking.setCustomer(customer);
                    newBooking.setGroupCode(groupCode);
                    newBooking.setStatus("RESERVED");
                    newBooking.setTotalAmount(BigDecimal.ZERO);
                    return bookingRepository.save(newBooking);
                });
    }

    private BigDecimal calculateBookingTotal(Booking booking) {
        List<BookingDetail> details = bookingDetailRepository.findAllByBooking(booking);
        BigDecimal total = BigDecimal.ZERO;
        for (BookingDetail detail : details) {
            if (detail.getPrice() != null) {
                total = total.add(detail.getPrice());
            }
        }
        return total;
    }

    private void syncBookingSummary(Booking booking) {
        List<BookingDetail> details = bookingDetailRepository.findAllByBooking(booking);
        if (details.isEmpty()) {
            booking.setCheckInDate(null);
            booking.setCheckOutDate(null);
            booking.setTotalAmount(BigDecimal.ZERO);
            return;
        }

        LocalDate minCheckIn = details.stream()
                .map(BookingDetail::getCheckInDate)
                .filter(date -> date != null)
                .min(LocalDate::compareTo)
                .orElse(null);
        LocalDate maxCheckOut = details.stream()
                .map(BookingDetail::getCheckOutDate)
                .filter(date -> date != null)
                .max(LocalDate::compareTo)
                .orElse(null);

        booking.setCheckInDate(minCheckIn);
        booking.setCheckOutDate(maxCheckOut);
        booking.setTotalAmount(calculateBookingTotal(booking));
        booking.setStatus(calculateBookingStatus(details));
    }

    private String calculateBookingStatus(List<BookingDetail> details) {
        boolean hasReserved = false;
        boolean hasOccupied = false;
        boolean hasActiveProgress = false;

        for (BookingDetail detail : details) {
            String status = detail.getRoom() != null && detail.getRoom().getStatus() != null
                    ? detail.getRoom().getStatus().trim().toUpperCase()
                    : "";
            switch (status) {
                case "OCCUPIED" -> {
                    hasOccupied = true;
                    hasActiveProgress = true;
                }
                case "RESERVED" -> {
                    hasReserved = true;
                    hasActiveProgress = true;
                }
                case "CHECKED-OUT", "HOUSEKEEPING", "AVAILABLE" -> {
                }
                default -> hasActiveProgress = true;
            }
        }

        if (hasOccupied) {
            return "OCCUPIED";
        }
        if (hasReserved) {
            return "RESERVED";
        }
        if (!hasActiveProgress) {
            return "COMPLETED";
        }
        return bookingStatusFallback(details);
    }

    private String bookingStatusFallback(List<BookingDetail> details) {
        for (BookingDetail detail : details) {
            String status = detail.getRoom() != null ? detail.getRoom().getStatus() : null;
            if (status != null && !status.isBlank()) {
                return status.toUpperCase();
            }
        }
        return "RESERVED";
    }

    public Room getRepresentativeRoom(String type, String rank) {
        return roomRepository.findByTypeAndRank(type, rank).stream().findFirst().orElse(null);
    }
}
