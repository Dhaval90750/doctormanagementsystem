package com.dsms.backend.repository;

import com.dsms.backend.domain.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByRelatedEntityTypeAndRelatedEntityId(String relatedEntityType, UUID relatedEntityId);
}
