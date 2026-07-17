package com.dsms.backend.repository;

import com.dsms.backend.domain.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, UUID> {
    List<Assignment> findByTopicId(UUID topicId);
    List<Assignment> findByCreatedById(UUID facultyId);
}
