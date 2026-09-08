package com.social.servicesocial.repository;
import com.social.servicesocial.model.RetraiteMembreFamille;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RetraiteMembreFamilleRepository extends JpaRepository<RetraiteMembreFamille, Long> { List<RetraiteMembreFamille> findByDossierRetraiteId(Long dossierRetraiteId); }
