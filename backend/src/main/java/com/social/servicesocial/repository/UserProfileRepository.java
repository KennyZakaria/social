package com.social.servicesocial.repository;

import com.social.servicesocial.model.UserProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByUsername(String username);

    Optional<UserProfile> findByMatricule(String matricule);

    boolean existsByUsername(String username);

    boolean existsByMatricule(String matricule);
}
