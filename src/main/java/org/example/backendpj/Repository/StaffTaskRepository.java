package org.example.backendpj.Repository;

import org.example.backendpj.Entity.StaffTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffTaskRepository extends JpaRepository<StaffTask, Integer> {

    List<StaffTask> findAllByOrderByCreatedAtDesc();

    List<StaffTask> findAllByAssignedStaff_User_IdOrderByCreatedAtDesc(Integer userId);
}
