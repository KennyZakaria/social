package com.social.servicesocial.dto;

import java.util.Set;

public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String role;
    private Set<String> allowedModules;

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
}
