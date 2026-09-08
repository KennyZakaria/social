package mutuelle_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sections")
public class SectionController {

    @GetMapping("/deces/dashboard")
    @PreAuthorize("hasAuthority('SECTION_DECES')")
    public ResponseEntity<?> decesDashboard() {

        return ResponseEntity.ok(
                "Décès dashboard"
        );
    }
}