package org.example.backendpj.Repository;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    Optional<Booking> findTopByCustomerAndStatus(Customer customer, String status);

    Optional<Booking> findTopByCustomer(Customer customer);

    Optional<Booking> findTopByGroupCode(String groupCode);
}
