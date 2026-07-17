package com.dsms.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class NoteDto {
    private String title;
    private String content;
    private UUID topicId;
    private boolean isPublic;
}
