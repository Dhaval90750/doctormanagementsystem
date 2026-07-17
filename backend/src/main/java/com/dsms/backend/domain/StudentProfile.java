package com.dsms.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import java.time.LocalDate;

@Entity
@Table(name = "student_profiles")
@Data
public class StudentProfile {

    @Id
    private UUID id; // Primary key matches User ID

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String enrollmentNumber;
    private String batchYear;
    private String courseType; // UG, PG, SS
    private LocalDate dateOfAdmission;
    
    // Guardian details
    private String guardianName;
    private String guardianPhone;
}
