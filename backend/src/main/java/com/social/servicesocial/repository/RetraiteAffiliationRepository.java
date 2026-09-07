package com.social.servicesocial.repository;
import com.social.servicesocial.model.RetraiteAffiliation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RetraiteAffiliationRepository extends JpaRepository<RetraiteAffiliation, Long> { List<RetraiteAffiliation> findByDossierRetraiteId(Long dossierRetraiteId); }
