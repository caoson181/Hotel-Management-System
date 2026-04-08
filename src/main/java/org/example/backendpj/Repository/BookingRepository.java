package org.example.backendpj.Repository;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    Optional<Booking> findTopByCustomerAndStatus(Customer customer, String status);

    Optional<Booking> findTopByCustomer(Customer customer);

    Optional<Booking> findTopByGroupCode(String groupCode);

    List<Booking> findAllByCustomerOrderByIdDesc(Customer customer);

    long countByCustomerAndStatusIgnoreCase(Customer customer, String status);

    @Query("""
            SELECT COALESCE(SUM(b.totalAmount), 0)
            FROM Booking b
            WHERE b.customer = :customer
              AND UPPER(b.status) = 'COMPLETED'
            """)
    BigDecimal sumCompletedTotalAmountByCustomer(@Param("customer") Customer customer);
}
