package com.social.servicesocial.repository;
import com.social.servicesocial.model.RetraiteAssistance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RetraiteAssistanceRepository extends JpaRepository<RetraiteAssistance, Long> { List<RetraiteAssistance> findByDossierRetraiteId(Long dossierRetraiteId); }
