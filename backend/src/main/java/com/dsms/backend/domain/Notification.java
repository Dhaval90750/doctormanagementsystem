package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    private String message;

    @Column(name = "is_read")
    private boolean isRead = false;

    private String type; // e.g., MEETING_INVITE, SYSTEM_ALERT

    @CreationTimestamp
    private ZonedDateTime createdAt;
}
