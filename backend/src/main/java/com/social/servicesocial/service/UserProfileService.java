package com.social.servicesocial.service;

import com.social.servicesocial.dto.UserProfileRequest;
import com.social.servicesocial.dto.UserProfileResponse;
import com.social.servicesocial.model.AppRole;
import com.social.servicesocial.model.SocialModule;
import com.social.servicesocial.model.UserProfile;
import com.social.servicesocial.repository.UserProfileRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileService(UserProfileRepository userProfileRepository, PasswordEncoder passwordEncoder) {
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserProfileResponse> listUsers() {
        return userProfileRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserProfileResponse getById(Long id) {
        return toResponse(findRequired(id));
    }

    public UserProfileResponse create(UserProfileRequest request) {
        if (userProfileRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userProfileRepository.existsByMatricule(request.getMatricule())) {
            throw new IllegalArgumentException("Matricule already exists");
        }

        UserProfile user = new UserProfile();
        user.setUsername(request.getUsername());
        user.setMatricule(request.getMatricule());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(parseRole(request.getRole()));
        user.setAllowedModules(parseModules(request.getAllowedModules()));
        user.setActive(request.isActive());
        return toResponse(userProfileRepository.save(user));
    }

    public UserProfileResponse update(Long id, UserProfileRequest request) {
        UserProfile user = findRequired(id);

        user.setMatricule(request.getMatricule());
        user.setFullName(request.getFullName());
        user.setRole(parseRole(request.getRole()));
        user.setAllowedModules(parseModules(request.getAllowedModules()));
        user.setActive(request.isActive());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        return toResponse(userProfileRepository.save(user));
    }

    public UserProfileResponse toggleActive(Long id) {
        UserProfile user = findRequired(id);
        user.setActive(!user.isActive());
        return toResponse(userProfileRepository.save(user));
    }

    public void delete(Long id) {
        userProfileRepository.delete(findRequired(id));
    }

    private UserProfile findRequired(Long id) {
        return userProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable : " + id));
    }

    private AppRole parseRole(String value) {
        return AppRole.valueOf(value.trim().toUpperCase());
    }

    private Set<SocialModule> parseModules(Set<String> values) {
        if (values == null) {
            return Set.of();
        }
        return values.stream().map(v -> SocialModule.valueOf(v.trim().toUpperCase())).collect(Collectors.toSet());
    }

    private UserProfileResponse toResponse(UserProfile user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setMatricule(user.getMatricule());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().name());
        response.setAllowedModules(user.getAllowedModules().stream().map(Enum::name).collect(Collectors.toSet()));
        response.setActive(user.isActive());
        return response;
    }
}
