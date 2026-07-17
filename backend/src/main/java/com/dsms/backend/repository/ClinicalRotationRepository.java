package com.dsms.backend.repository;

import com.dsms.backend.domain.ClinicalRotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClinicalRotationRepository extends JpaRepository<ClinicalRotation, UUID> {
    List<ClinicalRotation> findByDepartmentId(UUID departmentId);
    List<ClinicalRotation> findBySupervisorId(UUID supervisorId);
}
