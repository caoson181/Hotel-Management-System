package org.example.backendpj.Repository;

import org.example.backendpj.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsernameOrEmail(String username, String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    Page<User> findByRoleNot(String role, Pageable pageable);

    Page<User> findByFullNameContainingIgnoreCaseAndRoleNot(
            String fullName,
            String role,
            Pageable pageable);
    Page<User> findByRole(String role, Pageable pageable);

    Page<User> findByFullNameContainingIgnoreCaseAndRole(
            String keyword, String role, Pageable pageable);

}