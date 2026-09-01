package com.social.servicesocial.service;

import com.social.servicesocial.model.CaseRecord;
import com.social.servicesocial.model.SocialModule;
import com.social.servicesocial.repository.CaseRecordRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CaseRecordService {

    private final CaseRecordRepository caseRecordRepository;

    public CaseRecordService(CaseRecordRepository caseRecordRepository) {
        this.caseRecordRepository = caseRecordRepository;
    }

    public List<CaseRecord> getByModule(SocialModule module) {
        return caseRecordRepository.findByModuleOrderByLastUpdatedDesc(module);
    }

    public CaseRecord create(SocialModule module, CaseRecord caseRecord) {
        caseRecord.setId(null);
        caseRecord.setModule(module);
        return caseRecordRepository.save(caseRecord);
    }

    public CaseRecord update(Long id, CaseRecord payload) {
        CaseRecord existing = caseRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Case not found: " + id));

        existing.setTitle(payload.getTitle());
        existing.setMemberName(payload.getMemberName());
        existing.setPriority(payload.getPriority());
        existing.setStatus(payload.getStatus());
        existing.setDueDate(payload.getDueDate());
        existing.setNotes(payload.getNotes());

        return caseRecordRepository.save(existing);
    }

    public void delete(Long id) {
        caseRecordRepository.deleteById(id);
    }
}
