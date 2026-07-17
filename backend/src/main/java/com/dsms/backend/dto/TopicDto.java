package com.dsms.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TopicDto {
    private String title;
    private String description;
    private BigDecimal estimatedHours;
}
