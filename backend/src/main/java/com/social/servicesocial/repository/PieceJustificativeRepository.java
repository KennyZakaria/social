package com.social.servicesocial.repository;
import com.social.servicesocial.model.PieceJustificative;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PieceJustificativeRepository extends JpaRepository<PieceJustificative,Long> {
 List<PieceJustificative> findByDossierIdOrderByTypePieceAsc(Long dossierId);
 Optional<PieceJustificative> findByDossierIdAndTypePiece(Long dossierId,String typePiece);
}
