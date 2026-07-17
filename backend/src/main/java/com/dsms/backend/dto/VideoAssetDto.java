package com.dsms.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class VideoAssetDto {
    private UUID id;
    private String title;
    private String description;
    private UUID topicId;
    private String originalFileUrl;
    private String status;
}
