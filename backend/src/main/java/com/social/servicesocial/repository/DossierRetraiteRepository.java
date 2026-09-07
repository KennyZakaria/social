package com.social.servicesocial.repository;

import com.social.servicesocial.model.DossierRetraite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DossierRetraiteRepository extends JpaRepository<DossierRetraite, Long> {
    Optional<DossierRetraite> findByDossierId(Long dossierId);
    boolean existsByAdherentId(Long adherentId);
}
