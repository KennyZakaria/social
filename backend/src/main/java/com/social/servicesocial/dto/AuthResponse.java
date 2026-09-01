package com.social.servicesocial.dto;

import java.util.Set;

public class AuthResponse {
    private String token;
    private String username;
    private String fullName;
    private String role;
    private Set<String> allowedModules;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
}
