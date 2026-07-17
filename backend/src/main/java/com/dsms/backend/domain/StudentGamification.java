package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "student_gamification")
@Data
public class StudentGamification {
    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private User student;

    private int totalXp = 0;
    private int currentStreak = 0;
    private int longestStreak = 0;
    
    @Column(columnDefinition = "TEXT")
    private String badges; // JSON representation of earned badges
    
    private ZonedDateTime lastAttendanceDate;

    @UpdateTimestamp
    private ZonedDateTime updatedAt;
}
