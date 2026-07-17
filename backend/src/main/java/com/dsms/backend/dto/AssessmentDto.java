package com.dsms.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class AssessmentDto {
    private UUID departmentId;
    private String title;
    private String assessmentType;
    private BigDecimal maxMarks;
    private LocalDate assessmentDate;
    private UUID conductedBy;
}
