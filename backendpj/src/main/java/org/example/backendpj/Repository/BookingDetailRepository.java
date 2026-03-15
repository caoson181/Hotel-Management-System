package org.example.backendpj.Repository;

import org.example.backendpj.Entity.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, Integer> {}