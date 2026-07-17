package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "video_assets")
@Data
public class VideoAsset {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    private String thumbnailUrl;
    private String hlsPlaylistUrl;
    private String originalFileUrl;
    private Long durationSeconds;

    private String status; // PROCESSING, READY, FAILED

    @CreationTimestamp
    @Column(updatable = false)
    private ZonedDateTime uploadedAt;
}
