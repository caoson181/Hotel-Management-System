package org.example.backendpj.Repository;

import org.example.backendpj.Entity.User;
import org.example.backendpj.Entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Integer> {
    Optional<Wallet> findByUser(User user);
}
