package com.social.servicesocial.repository;

import com.social.servicesocial.model.DossierRetraite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface DossierRetraiteRepository extends JpaRepository<DossierRetraite, Long> {
    Optional<DossierRetraite> findByDossierId(Long dossierId);
    @Query("select (count(r) > 0) from DossierRetraite r where lower(r.dossier.matricule) = lower(:matricule)")
    boolean existsByDossierMatriculeIgnoreCase(@Param("matricule") String matricule);
    boolean existsByAdherentId(Long adherentId);
}
