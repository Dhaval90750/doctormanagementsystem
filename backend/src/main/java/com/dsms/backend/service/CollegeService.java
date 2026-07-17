package com.dsms.backend.service;

import com.dsms.backend.domain.College;
import com.dsms.backend.dto.CollegeDto;
import com.dsms.backend.repository.CollegeRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CollegeService {

    private final CollegeRepository collegeRepository;
    private final JdbcTemplate jdbcTemplate;

    public CollegeService(CollegeRepository collegeRepository, JdbcTemplate jdbcTemplate) {
        this.collegeRepository = collegeRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public College createCollege(CollegeDto dto) {
        String schemaName = "college_" + dto.getCode().toLowerCase().replaceAll("[^a-z0-9]", "");
        
        if (collegeRepository.existsBySchemaName(schemaName)) {
            throw new IllegalArgumentException("College code already in use or schema exists.");
        }

        College college = new College();
        college.setName(dto.getName());
        college.setCode(dto.getCode());
        college.setSchemaName(schemaName);
        college.setUniversityAffiliation(dto.getUniversityAffiliation());
        college.setAddress(dto.getAddress());
        college.setContactEmail(dto.getContactEmail());
        college.setContactPhone(dto.getContactPhone());
        college.setActive(true);

        College savedCollege = collegeRepository.save(college);

        // Dynamically create schema
        jdbcTemplate.execute("CREATE SCHEMA IF NOT EXISTS " + schemaName);
        
        // Trigger Flyway for this new schema
        org.flywaydb.core.Flyway flyway = org.flywaydb.core.Flyway.configure()
                .dataSource(jdbcTemplate.getDataSource())
                .locations("classpath:db/migration/tenant")
                .schemas(schemaName)
                .load();
        flyway.migrate();
        
        return savedCollege;
    }

    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    public College getCollegeById(UUID id) {
        return collegeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("College not found"));
    }
}
