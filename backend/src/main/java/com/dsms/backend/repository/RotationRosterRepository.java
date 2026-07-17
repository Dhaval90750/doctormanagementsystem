package com.dsms.backend.repository;

import com.dsms.backend.domain.RotationRoster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RotationRosterRepository extends JpaRepository<RotationRoster, UUID> {
    List<RotationRoster> findByRotationId(UUID rotationId);
    List<RotationRoster> findByStudentId(UUID studentId);
}
