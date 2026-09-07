package com.social.servicesocial.service;

import com.social.servicesocial.dto.AuthRequest;
import com.social.servicesocial.dto.AuthResponse;
import com.social.servicesocial.dto.RegisterRequest;
import com.social.servicesocial.model.AppRole;
import com.social.servicesocial.model.SocialModule;
import com.social.servicesocial.model.UserProfile;
import com.social.servicesocial.repository.UserProfileRepository;
import com.social.servicesocial.security.JwtService;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserProfileRepository userProfileRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse signup(RegisterRequest request) {
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
        user.setActive(true);

        userProfileRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserProfile user = userProfileRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        return buildAuthResponse(user);
    }

    public AuthResponse me(String username) {
        UserProfile user = userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return buildAuthResponse(user);
    }

    private AppRole parseRole(String value) {
        if (value == null || value.isBlank()) {
            return AppRole.AGENT;
        }
        return AppRole.valueOf(value.trim().toUpperCase());
    }

    private Set<SocialModule> parseModules(Set<String> values) {
        if (values == null || values.isEmpty()) {
            return Set.of();
        }
        return values.stream()
                .map(v -> SocialModule.valueOf(v.trim().toUpperCase()))
                .collect(Collectors.toSet());
    }

    private AuthResponse buildAuthResponse(UserProfile user) {
        AuthResponse response = new AuthResponse();
        response.setToken(jwtService.generateToken(
                org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                        .password(user.getPasswordHash())
                        .authorities(Collections.emptyList())
                        .build()
        ));
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().name());
        response.setAllowedModules(user.getAllowedModules().stream().map(Enum::name).collect(Collectors.toSet()));
        return response;
    }
}
