package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "rotation_rosters")
@Data
public class RotationRoster {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rotation_id", nullable = false)
    private ClinicalRotation rotation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    private String status; // ASSIGNED, COMPLETED, IN_PROGRESS
    
    @Column(columnDefinition = "TEXT")
    private String supervisorFeedback;
    
    private Integer grade; // Evaluation score out of 100
}
