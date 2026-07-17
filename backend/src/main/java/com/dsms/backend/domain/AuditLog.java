package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
    @Id
    @GeneratedValue
    private UUID id;

    private String userId; // email or UUID
    
    @Column(nullable = false)
    private String action; // e.g., "CREATE_USER", "UPDATE_DEPARTMENT"
    
    private String entityName;
    private String entityId;
    
    @Column(columnDefinition = "TEXT")
    private String details; // JSON representation of changes or extra info
    
    private String ipAddress;

    @CreationTimestamp
    private ZonedDateTime timestamp;
}
