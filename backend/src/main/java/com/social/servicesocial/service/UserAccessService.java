package com.social.servicesocial.service;

import com.social.servicesocial.model.AppRole;
import com.social.servicesocial.model.SocialModule;
import com.social.servicesocial.model.UserProfile;
import com.social.servicesocial.repository.UserProfileRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class UserAccessService {

    private final UserProfileRepository userProfileRepository;

    public UserAccessService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public boolean canAccessModule(Authentication authentication, String moduleName) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        UserProfile user = userProfileRepository.findByUsername(authentication.getName()).orElse(null);
        if (user == null || !user.isActive()) {
            return false;
        }

        if (user.getRole() == AppRole.ADMIN) {
            return true;
        }

        SocialModule module = SocialModule.valueOf(moduleName.toUpperCase());
        return user.getAllowedModules().contains(module);
    }
}
