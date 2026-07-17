package com.dsms.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class RotationRosterDto {
    private UUID id;
    private UUID rotationId;
    private UUID studentId;
    private String status;
    private String supervisorFeedback;
    private Integer grade;
}
