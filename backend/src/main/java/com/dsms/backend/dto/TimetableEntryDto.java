package com.dsms.backend.dto;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class TimetableEntryDto {
    private UUID departmentId;
    private UUID topicId;
    private UUID facultyId;
    private UUID facilityId;
    private String sessionType;
    private ZonedDateTime startTime;
    private ZonedDateTime endTime;
    private String batchYear;
}
