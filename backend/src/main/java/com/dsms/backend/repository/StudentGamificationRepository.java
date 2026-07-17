package com.dsms.backend.repository;

import com.dsms.backend.domain.StudentGamification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentGamificationRepository extends JpaRepository<StudentGamification, UUID> {
    Optional<StudentGamification> findByStudentId(UUID studentId);
}
