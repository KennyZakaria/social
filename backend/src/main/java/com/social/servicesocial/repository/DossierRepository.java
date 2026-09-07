package com.social.servicesocial.repository;

import com.social.servicesocial.model.Dossier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DossierRepository
        extends JpaRepository<Dossier, Long>, JpaSpecificationExecutor<Dossier> {

    boolean existsByNumeroAndIdNot(String numero, Long id);
}
