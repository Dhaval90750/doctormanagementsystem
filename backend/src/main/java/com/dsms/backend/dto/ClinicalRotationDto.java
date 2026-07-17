package com.dsms.backend.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class ClinicalRotationDto {
    private UUID id;
    private String title;
    private UUID departmentId;
    private UUID supervisorId;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
}
