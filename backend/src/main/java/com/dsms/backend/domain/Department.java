package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "departments") // no schema hardcoded, will use search_path
@Data
public class Department {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String code;
    private String description;

    @Column(name = "hod_id")
    private UUID hodId;

    private boolean isClinical = false;

    @CreationTimestamp
    private ZonedDateTime createdAt;

    @UpdateTimestamp
    private ZonedDateTime updatedAt;
}
