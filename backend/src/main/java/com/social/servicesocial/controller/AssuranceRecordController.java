package com.social.servicesocial.controller;

import com.social.servicesocial.dto.AssuranceRecordRequest;
import com.social.servicesocial.dto.AssuranceRecordResponse;
import com.social.servicesocial.model.AssuranceRecordType;
import com.social.servicesocial.service.AssuranceRecordService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assurance/records")
@RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'ASSURANCE_SOCIALE')")
public class AssuranceRecordController {

    private final AssuranceRecordService service;

    @GetMapping
    public ResponseEntity<List<AssuranceRecordResponse>> list(
            @RequestParam(required = false) AssuranceRecordType type,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean imputable,
            @RequestParam(required = false) String referenceEnvoi) {
        return ResponseEntity.ok(service.list(type, search, imputable, referenceEnvoi));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssuranceRecordResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<AssuranceRecordResponse> create(@Valid @RequestBody AssuranceRecordRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssuranceRecordResponse> update(@PathVariable Long id, @Valid @RequestBody AssuranceRecordRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export(
            @RequestParam(required = false) AssuranceRecordType type,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean imputable,
            @RequestParam(required = false) String referenceEnvoi) {
        byte[] content = service.exportExcel(type, search, imputable, referenceEnvoi);
        String filename = type == null ? "historique-assurance.xlsx" : type.name().toLowerCase() + "-assurance.xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(filename).build().toString())
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(content);
    }
}