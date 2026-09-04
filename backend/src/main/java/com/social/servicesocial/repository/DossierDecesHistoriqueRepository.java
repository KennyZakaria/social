package com.social.servicesocial.repository;

import com.social.servicesocial.model.DossierDecesHistorique;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DossierDecesHistoriqueRepository extends JpaRepository<DossierDecesHistorique, Long> {
    List<DossierDecesHistorique> findByDossierIdOrderByDateActionDesc(Long dossierId);
}
