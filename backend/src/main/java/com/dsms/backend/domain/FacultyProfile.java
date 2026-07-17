package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDate;

@Entity
@Table(name = "faculty_profiles")
@Data
public class FacultyProfile {

    @Id
    private UUID id; // Primary key matches User ID

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String employeeId;
    private String designation; // Professor, Assistant Professor, etc.
    private String specialization;
    
    private LocalDate joiningDate;
    private String medicalRegistrationNumber;
}
