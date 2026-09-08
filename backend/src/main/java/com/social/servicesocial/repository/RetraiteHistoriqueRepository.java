package com.social.servicesocial.repository;
import com.social.servicesocial.model.RetraiteHistorique;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RetraiteHistoriqueRepository extends JpaRepository<RetraiteHistorique, Long> { List<RetraiteHistorique> findByDossierRetraiteIdOrderByDateActionDesc(Long dossierRetraiteId); }
