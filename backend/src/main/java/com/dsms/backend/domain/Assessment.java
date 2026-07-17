package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "assessments")
@Data
public class Assessment {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(nullable = false)
    private String title;

    @Column(name = "assessment_type")
    private String assessmentType;

    @Column(name = "max_marks", nullable = false)
    private BigDecimal maxMarks;

    @Column(name = "assessment_date", nullable = false)
    private LocalDate assessmentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conducted_by")
    private User conductedBy;

    @CreationTimestamp
    private ZonedDateTime createdAt;
}
