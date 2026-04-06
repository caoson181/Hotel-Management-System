package org.example.backendpj.Repository;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.BookingDetail;
import org.example.backendpj.Entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, Integer> {
    List<BookingDetail> findAllByBooking(Booking booking);

    BookingDetail findByRoom(Room room);

    Optional<BookingDetail> findTopByRoomOrderByIdDesc(Room room);

    List<BookingDetail> findAllByRoom(Room room);

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
}
