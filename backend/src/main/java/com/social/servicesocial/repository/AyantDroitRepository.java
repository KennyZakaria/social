package com.social.servicesocial.repository;

import com.social.servicesocial.model.AyantDroit;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AyantDroitRepository extends JpaRepository<AyantDroit, Long> {
    List<AyantDroit> findByAdherentIdOrderByIdAsc(Long adherentId);
    Optional<AyantDroit> findByIdAndAdherentId(Long id, Long adherentId);
}