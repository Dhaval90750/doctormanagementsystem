package com.dsms.backend.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class DepartmentDto {
    private String name;
    private String code;
    private String description;
    private UUID hodId;
    private boolean isClinical;
}
