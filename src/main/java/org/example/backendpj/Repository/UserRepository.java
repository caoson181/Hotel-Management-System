package org.example.backendpj.Repository;

import org.example.backendpj.Entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepository extends JpaRepository<User, Integer> {

        Optional<User> findByUsernameOrEmail(String username, String email);

        Optional<User> findByUsername(String username);

        Optional<User> findByEmail(String email);

        boolean existsByEmail(String email);

        boolean existsByUsername(String username);

        @EntityGraph(attributePaths = "staff")
        Page<User> findByRoleNot(String role, Pageable pageable);

        @EntityGraph(attributePaths = "staff")
        Page<User> findByFullNameContainingIgnoreCaseAndRoleNot(
                        String fullName,
                        String role,
                        Pageable pageable);

        @EntityGraph(attributePaths = "staff")
        Page<User> findByRole(String role, Pageable pageable);

        @EntityGraph(attributePaths = "staff")
        Page<User> findByFullNameContainingIgnoreCaseAndRole(
                        String keyword, String role, Pageable pageable);

        long countByRole(String role);

        long countByRoleNot(String role);

        Page<User> findByRoleAndEnabled(String role, boolean enabled, Pageable pageable);

        Page<User> findByFullNameContainingIgnoreCaseAndRoleAndEnabled(
                        String keyword, String role, boolean enabled, Pageable pageable);

        long countByRoleAndEnabled(String role, boolean enabled);

}