package mutuelle_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mutuelle_backend.dto.DossierDecesRequest;
import mutuelle_backend.dto.DossierDecesResponse;
import mutuelle_backend.service.DossierDecesService;

@RestController
@RequestMapping("/api/deces/dossiers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DossierDecesController {

    private final DossierDecesService dossierDecesService;

    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping
    public ResponseEntity<DossierDecesResponse> create(
            @Valid @RequestBody DossierDecesRequest request
    ) {

        DossierDecesResponse response =
                dossierDecesService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public ResponseEntity<List<DossierDecesResponse>> findAll() {

        return ResponseEntity.ok(
                dossierDecesService.findAll()
        );
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<DossierDecesResponse> findById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                dossierDecesService.findById(id)
        );
    }
}