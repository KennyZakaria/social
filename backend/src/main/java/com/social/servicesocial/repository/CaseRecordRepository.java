package com.social.servicesocial.repository;

import com.social.servicesocial.model.CaseRecord;
import com.social.servicesocial.model.SocialModule;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRecordRepository extends JpaRepository<CaseRecord, Long> {

    List<CaseRecord> findByModuleOrderByLastUpdatedDesc(SocialModule module);

    long countByModule(SocialModule module);
}
