package com.dsms.backend.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class MeetingDto {
    private String title;
    private String description;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;
    private String locationOrLink;
    private UUID organizerId;
    private List<UUID> attendeeIds;
}
