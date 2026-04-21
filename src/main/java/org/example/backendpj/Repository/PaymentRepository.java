package org.example.backendpj.Repository;

import org.example.backendpj.Entity.Booking;
import org.example.backendpj.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    boolean existsByBookingAndPaymentMethodIgnoreCaseAndStatusIgnoreCase(Booking booking,
                                                                         String paymentMethod,
                                                                         String status);

    @Query("""
            SELECT COALESCE(SUM(p.amount), 0)
            FROM Payment p
            WHERE p.status = 'SUCCESS'
              AND p.paymentDate >= :start
              AND p.paymentDate < :end
              AND UPPER(p.paymentMethod) NOT IN ('REFUND', 'CANCELLATIONFEE')
            """)
    BigDecimal sumSuccessfulCashInByPaymentDateBetween(@Param("start") LocalDateTime start,
                                                       @Param("end") LocalDateTime end);

    @Query("""
            SELECT COALESCE(SUM(p.amount), 0)
            FROM Payment p
            WHERE p.status = 'SUCCESS'
              AND p.paymentDate >= :start
              AND p.paymentDate < :end
              AND UPPER(p.paymentMethod) = UPPER(:paymentMethod)
            """)
    BigDecimal sumSuccessfulAmountByMethodAndPaymentDateBetween(@Param("paymentMethod") String paymentMethod,
                                                                @Param("start") LocalDateTime start,
                                                                @Param("end") LocalDateTime end);
}
