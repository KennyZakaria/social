package com.social.servicesocial.repository;

import com.social.servicesocial.model.AyantDroit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AyantDroitRepository extends JpaRepository<AyantDroit, Long> {
    List<AyantDroit> findByDossier_Id(Long dossierId);
    void deleteByDossier_Id(Long dossierId);
}
