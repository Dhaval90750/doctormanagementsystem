package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "attendances")
@Data
public class Attendance {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "timetable_entry_id", nullable = false)
    private TimetableEntry timetableEntry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(nullable = false)
    private String status; // PRESENT, ABSENT, LATE, EXCUSED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marked_by")
    private User markedBy;

    @CreationTimestamp
    @Column(name = "marked_at")
    private ZonedDateTime markedAt;

    @Column(name = "is_qr_scanned")
    private boolean isQrScanned = false;
}
