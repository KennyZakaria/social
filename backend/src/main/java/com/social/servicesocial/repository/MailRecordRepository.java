package com.social.servicesocial.repository;

import com.social.servicesocial.model.MailRecord;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MailRecordRepository extends JpaRepository<MailRecord, Long> {

    List<MailRecord> findBySubjectContainingIgnoreCaseOrReceiverSectionContainingIgnoreCaseOrderByLastMovementAtDesc(
            String subject,
            String receiverSection
    );
}
