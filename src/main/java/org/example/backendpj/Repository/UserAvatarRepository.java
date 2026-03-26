package org.example.backendpj.Repository;

import org.example.backendpj.Entity.UserAvatar;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserAvatarRepository extends JpaRepository<UserAvatar, Integer> {

    List<UserAvatar> findByUserId(Integer userId);

    Optional<UserAvatar> findByUser_IdAndIsCurrentTrue(Integer userId);
}
