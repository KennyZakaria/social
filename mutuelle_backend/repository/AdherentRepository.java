package mutuelle_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import mutuelle_backend.entity.Adherent;

public interface AdherentRepository
        extends JpaRepository<Adherent, Long>,
                JpaSpecificationExecutor<Adherent> {

    boolean existsByMatriculeAndIdNot(
            String matricule,
            Long id
    );

    boolean existsByCinAndIdNot(
            String cin,
            Long id
    );
}