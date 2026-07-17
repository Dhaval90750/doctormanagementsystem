package com.dsms.backend.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class UserDto {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private UUID roleId;
    private UUID departmentId;
}
