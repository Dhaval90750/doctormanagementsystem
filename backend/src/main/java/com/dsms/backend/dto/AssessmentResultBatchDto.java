package com.dsms.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;
import java.util.List;

@Data
public class AssessmentResultBatchDto {
    private UUID assessmentId;
    private List<ResultEntry> results;

    @Data
    public static class ResultEntry {
        private UUID studentId;
        private BigDecimal marksObtained;
        private String remarks;
        private boolean isAbsent;
    }
}
