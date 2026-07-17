package com.dsms.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "colleges", schema = "platform")
@Data
public class College {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String code;
    private String schemaName;
    private String universityAffiliation;
    private String address;
    private String contactEmail;
    private String contactPhone;

    private boolean isActive = true;

    @CreationTimestamp
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    private ZonedDateTime updatedAt;
}
