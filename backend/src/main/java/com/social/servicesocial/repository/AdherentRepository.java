package com.social.servicesocial.repository;

import com.social.servicesocial.model.Adherent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AdherentRepository
        extends JpaRepository<Adherent, Long>, JpaSpecificationExecutor<Adherent> {

    boolean existsByMatriculeAndIdNot(String matricule, Long id);

    boolean existsByCinAndIdNot(String cin, Long id);
}
