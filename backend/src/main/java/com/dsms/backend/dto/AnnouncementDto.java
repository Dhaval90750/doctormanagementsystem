package com.dsms.backend.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class AnnouncementDto {
    private String title;
    private String content;
    private String targetRole;
    private UUID targetDepartmentId;
    private UUID createdById;
}
