package com.social.servicesocial.controller;
import com.social.servicesocial.dto.*;
import com.social.servicesocial.service.PieceJustificativeService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/deces/dossiers/{dossierId}/pieces-justificatives") @RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'DECES')")
public class PieceJustificativeController {
 private final PieceJustificativeService service;
 @GetMapping public List<PieceJustificativeResponse> list(@PathVariable Long dossierId){return service.list(dossierId);}
 @PutMapping("/{typePiece}") public PieceJustificativeResponse save(@PathVariable Long dossierId,@PathVariable String typePiece,@RequestBody PieceJustificativeRequest request){return service.save(dossierId,typePiece,request);}
 @PostMapping("/{typePiece}") public PieceJustificativeResponse saveWithPost(@PathVariable Long dossierId,@PathVariable String typePiece,@RequestBody PieceJustificativeRequest request){return service.save(dossierId,typePiece,request);}
}
