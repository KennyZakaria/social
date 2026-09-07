package com.social.servicesocial.repository;
import com.social.servicesocial.model.RetraiteRessourceMensuelle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RetraiteRessourceMensuelleRepository extends JpaRepository<RetraiteRessourceMensuelle, Long> { List<RetraiteRessourceMensuelle> findByDossierRetraiteId(Long dossierRetraiteId); }
