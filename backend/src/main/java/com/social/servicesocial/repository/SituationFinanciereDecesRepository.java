package com.social.servicesocial.repository;
import com.social.servicesocial.model.SituationFinanciereDeces;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SituationFinanciereDecesRepository extends JpaRepository<SituationFinanciereDeces, Long> { Optional<SituationFinanciereDeces> findByDossierId(Long dossierId); }