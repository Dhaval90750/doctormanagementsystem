package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;
import java.math.BigDecimal;

@Entity
@Table(name = "topics")
@Data
public class Topic {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "syllabus_id")
    private Syllabus syllabus;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "estimated_hours")
    private BigDecimal estimatedHours;

    @CreationTimestamp
    private ZonedDateTime createdAt;
}
