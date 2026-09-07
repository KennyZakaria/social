package com.social.servicesocial.repository;

import com.social.servicesocial.model.AssuranceRecord;
import com.social.servicesocial.model.AssuranceRecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AssuranceRecordRepository extends JpaRepository<AssuranceRecord, Long>, JpaSpecificationExecutor<AssuranceRecord> {
    boolean existsByNumero(String numero);
    long countByType(AssuranceRecordType type);
}