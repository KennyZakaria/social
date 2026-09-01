package com.social.servicesocial.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public class UserProfileRequest {
    @NotBlank @Size(max = 80)
    private String username;
    @NotBlank @Email @Size(max = 254)
    private String email;
    /** Optional on update: if blank, password is not changed. */
    @Size(min = 6, max = 100)
    private String password;
    @NotBlank @Size(max = 120)
    private String fullName;
    @NotBlank
    private String role;
    private Set<String> allowedModules;
    private boolean active = true;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Set<String> getAllowedModules() {
        return allowedModules;
    }

    public void setAllowedModules(Set<String> allowedModules) {
        this.allowedModules = allowedModules;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
