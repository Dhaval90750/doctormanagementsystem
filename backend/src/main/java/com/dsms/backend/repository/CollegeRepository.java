package com.dsms.backend.repository;

import com.dsms.backend.domain.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CollegeRepository extends JpaRepository<College, UUID> {
    boolean existsBySchemaName(String schemaName);
}
