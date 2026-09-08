package com.social.servicesocial.repository;
import com.social.servicesocial.model.RetraiteDonneeMedicoSociale;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RetraiteDonneeMedicoSocialeRepository extends JpaRepository<RetraiteDonneeMedicoSociale, Long> { List<RetraiteDonneeMedicoSociale> findByDossierRetraiteId(Long dossierRetraiteId); }
