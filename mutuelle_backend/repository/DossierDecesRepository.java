package mutuelle_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import mutuelle_backend.entity.DossierDeces;

public interface DossierDecesRepository
        extends JpaRepository<DossierDeces, Long> {

    Optional<DossierDeces> findByNumero(String numero);

    boolean existsByNumero(String numero);

    boolean existsByAdherentId(Long adherentId);
}