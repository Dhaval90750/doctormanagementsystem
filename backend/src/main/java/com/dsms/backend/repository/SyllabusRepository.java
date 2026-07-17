package com.dsms.backend.repository;

import com.dsms.backend.domain.Syllabus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SyllabusRepository extends JpaRepository<Syllabus, UUID> {
    List<Syllabus> findByDepartmentId(UUID departmentId);
}
