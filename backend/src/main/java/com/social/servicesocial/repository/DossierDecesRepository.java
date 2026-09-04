package com.social.servicesocial.repository;

import com.social.servicesocial.model.DossierDeces;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DossierDecesRepository extends JpaRepository<DossierDeces, Long> {
    Optional<DossierDeces> findByNumero(String numero);
    boolean existsByNumero(String numero);
    boolean existsByAdherentId(Long adherentId);
    Optional<DossierDeces> findByAdherentId(Long adherentId);
    List<DossierDeces> findByAdherentIdIn(Collection<Long> adherentIds);
}