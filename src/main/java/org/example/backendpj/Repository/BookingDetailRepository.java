package org.example.backendpj.Repository;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.BookingDetail;
import org.example.backendpj.Entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, Integer> {
    List<BookingDetail> findAllByBooking(Booking booking);

    BookingDetail findByRoom(Room room);

    Optional<BookingDetail> findTopByRoomOrderByIdDesc(Room room);
}