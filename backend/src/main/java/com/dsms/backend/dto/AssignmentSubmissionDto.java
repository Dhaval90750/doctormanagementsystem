package com.dsms.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class AssignmentSubmissionDto {
    private UUID id;
    private UUID assignmentId;
    private UUID studentId;
    private String content;
    private String fileUrl;
    private Integer marksAwarded;
    private String feedback;
}
