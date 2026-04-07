package org.example.backendpj.Repository;

import org.example.backendpj.Entity.DailyRevenue;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyRevenueRepository extends JpaRepository<DailyRevenue, LocalDate> {

  @Query(value = """
          SELECT *
          FROM daily_revenue
          WHERE YEAR(date) = :year AND MONTH(date) = :month
          ORDER BY date
      """, nativeQuery = true)
  List<DailyRevenue> findByMonth(@Param("year") int year,
      @Param("month") int month);
}