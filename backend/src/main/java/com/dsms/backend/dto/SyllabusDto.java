package com.dsms.backend.dto;

import lombok.Data;
import java.util.UUID;
import java.util.List;

@Data
public class SyllabusDto {
    private UUID departmentId;
    private String courseName;
    private String yearOrSemester;
    private String description;
    private List<TopicDto> topics;
}
