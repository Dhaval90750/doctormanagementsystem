package com.dsms.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "platform_users", schema = "platform")
@Data
public class PlatformUser {

    @Id
    @GeneratedValue
    private UUID id;

    private String email;
    
    private String passwordHash;
    
    private String fullName;
    
    private String role = "SUPER_ADMIN";
    
    private boolean isActive = true;
    
    private ZonedDateTime createdAt;
}
