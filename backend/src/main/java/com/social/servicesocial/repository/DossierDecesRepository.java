package com.social.servicesocial.repository;

import com.social.servicesocial.model.DossierDeces;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DossierDecesRepository extends JpaRepository<DossierDeces, Long> {

    Optional<DossierDeces> findByNumero(String numero);

    boolean existsByNumero(String numero);

    boolean existsByAdherentId(Long adherentId);
}
