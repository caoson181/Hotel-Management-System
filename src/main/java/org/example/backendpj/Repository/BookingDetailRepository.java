package org.example.backendpj.Repository;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.BookingDetail;
import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, Integer> {
    List<BookingDetail> findAllByBooking(Booking booking);

    BookingDetail findByRoom(Room room);

    Optional<BookingDetail> findTopByRoomOrderByIdDesc(Room room);

    List<BookingDetail> findAllByRoom(Room room);

    Optional<BookingDetail> findTopByBookingAndRoomAndCheckInDateAndCheckOutDateOrderByIdDesc(
            Booking booking,
            Room room,
            LocalDate checkInDate,
            LocalDate checkOutDate);

    @Query("""
            SELECT bd FROM BookingDetail bd
            WHERE bd.room = :room
              AND bd.checkInDate < :checkOut
              AND COALESCE(bd.actualCheckOutDate, bd.checkOutDate) > :checkIn
              AND (bd.status IS NULL OR UPPER(bd.status) <> 'NO_SHOW')
            """)
    List<BookingDetail> findOverlappingDetails(
            @Param("room") Room room,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut);

    @Query("""
            SELECT bd FROM BookingDetail bd
            WHERE bd.room = :room
              AND bd.checkInDate <= :targetDate
              AND COALESCE(bd.actualCheckOutDate, bd.checkOutDate) > :targetDate
              AND (bd.status IS NULL OR UPPER(bd.status) <> 'NO_SHOW')
            """)
    List<BookingDetail> findActiveDetailsByDate(
            @Param("room") Room room,
            @Param("targetDate") LocalDate targetDate);

    @Query("""
            SELECT bd FROM BookingDetail bd
            WHERE bd.room = :room
              AND bd.checkOutDate = :targetDate
            """)
    List<BookingDetail> findCheckOutDetailsByDate(
            @Param("room") Room room,
            @Param("targetDate") LocalDate targetDate);

    @Query("""
            SELECT COUNT(bd)
            FROM BookingDetail bd
            WHERE bd.actualCheckOutDate = :targetDate
            """)
    long countByActualCheckOutDate(@Param("targetDate") LocalDate targetDate);

    List<BookingDetail> findAllByActualCheckOutDate(LocalDate targetDate);

    List<BookingDetail> findAllByBooking_CustomerAndActualCheckOutDateIsNotNull(Customer customer);

    @Query("""
            SELECT COALESCE(SUM(bd.price), 0)
            FROM BookingDetail bd
            WHERE bd.actualCheckOutDate = :targetDate
              AND (bd.status IS NULL OR UPPER(bd.status) <> 'NO_SHOW')
            """)
    BigDecimal sumPriceByActualCheckOutDate(@Param("targetDate") LocalDate targetDate);

    @Query("""
            SELECT COALESCE(SUM(COALESCE(bd.finalAmount, bd.price)), 0)
            FROM BookingDetail bd
            WHERE bd.actualCheckOutDate = :targetDate
              AND (bd.status IS NULL OR UPPER(bd.status) <> 'NO_SHOW')
            """)
    BigDecimal sumFinalAmountByActualCheckOutDate(@Param("targetDate") LocalDate targetDate);

    @Query("""
            SELECT COALESCE(SUM(COALESCE(bd.finalAmount, bd.price)), 0)
            FROM BookingDetail bd
            WHERE bd.booking.customer = :customer
              AND bd.actualCheckOutDate IS NOT NULL
              AND (bd.status IS NULL OR UPPER(bd.status) <> 'NO_SHOW')
            """)
    BigDecimal sumCheckedOutFinalAmountByCustomer(@Param("customer") Customer customer);

    @Query("""
            SELECT COUNT(bd)
            FROM BookingDetail bd
            WHERE bd.booking.customer = :customer
              AND bd.actualCheckOutDate IS NOT NULL
              AND (bd.status IS NULL OR UPPER(bd.status) <> 'NO_SHOW')
            """)
    long countCheckedOutDetailsByCustomer(@Param("customer") Customer customer);
}
