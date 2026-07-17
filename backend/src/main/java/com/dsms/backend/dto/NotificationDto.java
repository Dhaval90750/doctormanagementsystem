package com.dsms.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class NotificationDto {
    private UUID userId;
    private String title;
    private String message;
    private String type;
}
