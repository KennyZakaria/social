package com.social.servicesocial.repository;
import com.social.servicesocial.model.PensionDeces;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PensionDecesRepository extends JpaRepository<PensionDeces, Long> { List<PensionDeces> findByDossierIdOrderByIdAsc(Long dossierId); void deleteByDossierId(Long dossierId); }