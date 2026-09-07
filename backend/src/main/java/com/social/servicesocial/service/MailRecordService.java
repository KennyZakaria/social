package com.social.servicesocial.service;

import com.social.servicesocial.model.MailRecord;
import com.social.servicesocial.repository.MailRecordRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MailRecordService {

    private final MailRecordRepository mailRecordRepository;

    public MailRecordService(MailRecordRepository mailRecordRepository) {
        this.mailRecordRepository = mailRecordRepository;
    }

    public List<MailRecord> getAll() {
        return mailRecordRepository.findAll().stream()
                .sorted((a, b) -> b.getLastMovementAt().compareTo(a.getLastMovementAt()))
                .toList();
    }

    public List<MailRecord> search(String term) {
        return mailRecordRepository
                .findBySubjectContainingIgnoreCaseOrReceiverSectionContainingIgnoreCaseOrderByLastMovementAtDesc(term, term);
    }

    public MailRecord create(MailRecord mailRecord) {
        mailRecord.setId(null);
        return mailRecordRepository.save(mailRecord);
    }

    public MailRecord update(Long id, MailRecord payload) {
        MailRecord existing = mailRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mail not found: " + id));

        existing.setSubject(payload.getSubject());
        existing.setSenderName(payload.getSenderName());
        existing.setReceiverSection(payload.getReceiverSection());
        existing.setDirection(payload.getDirection());
        existing.setStatus(payload.getStatus());
        existing.setUrgent(payload.isUrgent());

        return mailRecordRepository.save(existing);
    }
}
