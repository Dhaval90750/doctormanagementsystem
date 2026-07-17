package com.dsms.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class AttendanceDto {
    private UUID timetableEntryId;
    private UUID studentId;
    private String status;
    private UUID markedBy;
    private boolean isQrScanned;
}
