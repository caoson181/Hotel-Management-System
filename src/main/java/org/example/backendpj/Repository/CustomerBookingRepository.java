package org.example.backendpj.Repository;

import org.example.backendpj.Entity.CustomerBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerBookingRepository extends JpaRepository<CustomerBooking, Integer> {
    List<CustomerBooking> findAllByAssignedFalseOrderByCreatedAtDesc();
    List<CustomerBooking> findAllByOrderByCreatedAtDesc();
    List<CustomerBooking> findAllByGroupCodeOrderByIdAsc(String groupCode);
    List<CustomerBooking> findAllByGroupCode(String groupCode);

    List<CustomerBooking> findByCustomer_CustomerIdOrderByCreatedAtDesc(Integer customerId);

}

