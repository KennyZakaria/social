package com.social.servicesocial.repository;

import com.social.servicesocial.model.DemandeDeces;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DemandeDecesRepository extends JpaRepository<DemandeDeces, Long> {
    List<DemandeDeces> findByDossierIdOrderByDateDemandeDesc(Long dossierId);
}