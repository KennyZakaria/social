package com.social.servicesocial.repository;
import com.social.servicesocial.model.RetraiteChargeMensuelle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RetraiteChargeMensuelleRepository extends JpaRepository<RetraiteChargeMensuelle, Long> { List<RetraiteChargeMensuelle> findByDossierRetraiteId(Long dossierRetraiteId); }
