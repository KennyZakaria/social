package com.social.servicesocial.repository;
import com.social.servicesocial.model.AssuranceDeces;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AssuranceDecesRepository extends JpaRepository<AssuranceDeces, Long> { List<AssuranceDeces> findByDossierIdOrderByIdAsc(Long dossierId); void deleteByDossierId(Long dossierId); }