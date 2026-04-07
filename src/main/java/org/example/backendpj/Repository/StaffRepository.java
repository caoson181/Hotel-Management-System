package org.example.backendpj.Repository;

import java.util.Optional;

import org.example.backendpj.Entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StaffRepository extends JpaRepository<Staff, Integer> {

    Optional<Staff> findByUserId(Integer userId);

    @Query("SELECT COALESCE(SUM(s.salary), 0) FROM Staff s")
    Double sumAllSalary();

}
