package org.example.backendpj.Repository;

import org.example.backendpj.Entity.RentalContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface RentalContractRepository extends JpaRepository<RentalContract, Integer> {

    @Query("""
            SELECT COALESCE(SUM(rc.pricePerMonth), 0)
            FROM RentalContract rc
            WHERE UPPER(rc.status) = 'ACTIVE'
              AND rc.startDate <= :targetDate
              AND rc.endDate >= :targetDate
            """)
    BigDecimal sumActiveMonthlyRevenueByDate(@Param("targetDate") LocalDate targetDate);
}
