package com.social.servicesocial.controller;

import com.social.servicesocial.model.CaseRecord;
import com.social.servicesocial.model.SocialModule;
import com.social.servicesocial.service.CaseRecordService;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/modules")
public class ModuleCaseController {

    private final CaseRecordService caseRecordService;

    public ModuleCaseController(CaseRecordService caseRecordService) {
        this.caseRecordService = caseRecordService;
    }

    @GetMapping("/{module}")
    @PreAuthorize("@userAccessService.canAccessModule(authentication, #module)")
    public List<CaseRecord> list(@PathVariable String module) {
        return caseRecordService.getByModule(SocialModule.valueOf(module.toUpperCase()));
    }

    @PostMapping("/{module}")
    @PreAuthorize("@userAccessService.canAccessModule(authentication, #module)")
    public CaseRecord create(@PathVariable String module, @RequestBody CaseRecord caseRecord) {
        return caseRecordService.create(SocialModule.valueOf(module.toUpperCase()), caseRecord);
    }

    @PutMapping("/{module}/{id}")
    @PreAuthorize("@userAccessService.canAccessModule(authentication, #module)")
    public CaseRecord update(@PathVariable String module, @PathVariable Long id, @RequestBody CaseRecord caseRecord) {
        return caseRecordService.update(id, caseRecord);
    }

    @DeleteMapping("/{module}/{id}")
    @PreAuthorize("@userAccessService.canAccessModule(authentication, #module)")
    public void delete(@PathVariable String module, @PathVariable Long id) {
        caseRecordService.delete(id);
    }
}
