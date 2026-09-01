package com.social.servicesocial.controller;

import com.social.servicesocial.dto.UserProfileRequest;
import com.social.servicesocial.dto.UserProfileResponse;
import com.social.servicesocial.service.UserProfileService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserManagementController {

    private final UserProfileService userProfileService;

    public UserManagementController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public List<UserProfileResponse> list() {
        return userProfileService.listUsers();
    }

    @GetMapping("/{id}")
    public UserProfileResponse getById(@PathVariable Long id) {
        return userProfileService.getById(id);
    }

    @PostMapping
    public ResponseEntity<UserProfileResponse> create(@Valid @RequestBody UserProfileRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userProfileService.create(request));
    }

    @PutMapping("/{id}")
    public UserProfileResponse update(@PathVariable Long id, @Valid @RequestBody UserProfileRequest request) {
        return userProfileService.update(id, request);
    }

    @PatchMapping("/{id}/toggle-active")
    public UserProfileResponse toggleActive(@PathVariable Long id) {
        return userProfileService.toggleActive(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userProfileService.delete(id);
    }
}
