package com.social.servicesocial.controller;

import com.social.servicesocial.model.SocialModule;
import com.social.servicesocial.repository.CaseRecordRepository;
import com.social.servicesocial.repository.MailRecordRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final CaseRecordRepository caseRecordRepository;
    private final MailRecordRepository mailRecordRepository;

    public DashboardController(CaseRecordRepository caseRecordRepository, MailRecordRepository mailRecordRepository) {
        this.caseRecordRepository = caseRecordRepository;
        this.mailRecordRepository = mailRecordRepository;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public Map<String, Object> summary() {
        Map<String, Object> modules = new LinkedHashMap<>();
        for (SocialModule module : SocialModule.values()) {
            modules.put(module.name(), caseRecordRepository.countByModule(module));
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("moduleCases", modules);
        payload.put("totalCases", caseRecordRepository.count());
        payload.put("totalMails", mailRecordRepository.count());
        return payload;
    }
}
