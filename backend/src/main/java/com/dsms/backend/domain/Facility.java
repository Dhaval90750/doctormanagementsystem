package com.dsms.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "facilities")
@Data
public class Facility {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String type; // LECTURE_HALL, LAB, WARD, OT, SEMINAR_ROOM
    private Integer capacity;
    private String locationDetails;
    private boolean isActive = true;
}
