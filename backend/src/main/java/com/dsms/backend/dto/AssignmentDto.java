package com.dsms.backend.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class AssignmentDto {
    private UUID id;
    private String title;
    private String description;
    private UUID topicId;
    private UUID createdBy;
    private ZonedDateTime dueDate;
    private int maxMarks;
}
