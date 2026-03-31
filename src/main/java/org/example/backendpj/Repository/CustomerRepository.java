package org.example.backendpj.Repository;

import org.example.backendpj.Entity.Customer;
import org.example.backendpj.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByUser(User user);

    Customer findByUser_Id(Integer userId);
}