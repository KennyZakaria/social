package com.social.servicesocial.controller;

import com.social.servicesocial.model.MailRecord;
import com.social.servicesocial.service.MailRecordService;
import java.util.List;
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
@RequestMapping("/api/bureau-order")
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'BUREAU_ORDRE')")
public class BureauOrderController {

    private final MailRecordService mailRecordService;

    public BureauOrderController(MailRecordService mailRecordService) {
        this.mailRecordService = mailRecordService;
    }

    @GetMapping
    public List<MailRecord> list(@RequestParam(required = false) String q) {
        if (q == null || q.isBlank()) {
            return mailRecordService.getAll();
        }
        return mailRecordService.search(q);
    }

    @PostMapping
    public MailRecord create(@RequestBody MailRecord mailRecord) {
        return mailRecordService.create(mailRecord);
    }

    @PutMapping("/{id}")
    public MailRecord update(@PathVariable Long id, @RequestBody MailRecord mailRecord) {
        return mailRecordService.update(id, mailRecord);
    }
}
