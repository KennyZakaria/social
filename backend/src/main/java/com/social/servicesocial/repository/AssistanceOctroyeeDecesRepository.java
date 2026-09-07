package com.social.servicesocial.repository;
import com.social.servicesocial.model.AssistanceOctroyeeDeces;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AssistanceOctroyeeDecesRepository extends JpaRepository<AssistanceOctroyeeDeces, Long> { List<AssistanceOctroyeeDeces> findByDossierIdOrderByIdAsc(Long dossierId); void deleteByDossierId(Long dossierId); }