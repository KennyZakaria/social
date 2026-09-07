package com.social.servicesocial.repository;
import com.social.servicesocial.model.LiquidationDroitDeces;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LiquidationDroitDecesRepository extends JpaRepository<LiquidationDroitDeces, Long> { List<LiquidationDroitDeces> findByDossierIdOrderByIdAsc(Long dossierId); void deleteByDossierId(Long dossierId); }