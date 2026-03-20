package org.example.backendpj.Repository;

import java.util.Optional;

import org.example.backendpj.Entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff, Integer> {

    Optional<Staff> findByUserId(Integer userId);

}