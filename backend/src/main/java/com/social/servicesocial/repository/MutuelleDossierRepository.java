package com.social.servicesocial.repository;

import com.social.servicesocial.model.MutuelleDossier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MutuelleDossierRepository extends JpaRepository<MutuelleDossier, Long>, JpaSpecificationExecutor<MutuelleDossier> {
    boolean existsByNumeroDossier(String numeroDossier);
    long count();
}
