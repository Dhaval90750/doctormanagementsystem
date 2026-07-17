package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "meeting_attendees")
@Data
public class MeetingAttendee {

    @EmbeddedId
    private Id id = new Id();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("meetingId")
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "rsvp_status")
    private String rsvpStatus = "PENDING";

    @Data
    @Embeddable
    public static class Id implements Serializable {
        private UUID meetingId;
        private UUID userId;
    }
}
