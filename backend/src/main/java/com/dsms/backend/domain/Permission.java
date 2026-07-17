package com.dsms.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "permissions")
@Data
public class Permission {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String module;
    private String description;
}
