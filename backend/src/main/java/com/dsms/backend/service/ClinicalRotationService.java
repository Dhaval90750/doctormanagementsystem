package com.dsms.backend.service;

import com.dsms.backend.domain.ClinicalRotation;
import com.dsms.backend.domain.RotationRoster;
import com.dsms.backend.dto.ClinicalRotationDto;
import com.dsms.backend.dto.RotationRosterDto;
import com.dsms.backend.repository.ClinicalRotationRepository;
import com.dsms.backend.repository.DepartmentRepository;
import com.dsms.backend.repository.RotationRosterRepository;
import com.dsms.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ClinicalRotationService {

    private final ClinicalRotationRepository rotationRepository;
    private final RotationRosterRepository rosterRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public ClinicalRotationService(ClinicalRotationRepository rotationRepository, 
                                   RotationRosterRepository rosterRepository, 
                                   DepartmentRepository departmentRepository, 
                                   UserRepository userRepository) {
        this.rotationRepository = rotationRepository;
        this.rosterRepository = rosterRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ClinicalRotation createRotation(ClinicalRotationDto dto) {
        ClinicalRotation rotation = new ClinicalRotation();
        rotation.setTitle(dto.getTitle());
        rotation.setStartDate(dto.getStartDate());
        rotation.setEndDate(dto.getEndDate());
        rotation.setDepartment(departmentRepository.findById(dto.getDepartmentId()).orElseThrow());
        rotation.setSupervisor(userRepository.findById(dto.getSupervisorId()).orElseThrow());
        
        return rotationRepository.save(rotation);
    }
    
    public List<ClinicalRotation> getRotationsByDepartment(UUID departmentId) {
        return rotationRepository.findByDepartmentId(departmentId);
    }

    @Transactional
    public RotationRoster assignStudent(RotationRosterDto dto) {
        RotationRoster roster = new RotationRoster();
        roster.setRotation(rotationRepository.findById(dto.getRotationId()).orElseThrow());
        roster.setStudent(userRepository.findById(dto.getStudentId()).orElseThrow());
        roster.setStatus(dto.getStatus() != null ? dto.getStatus() : "ASSIGNED");
        return rosterRepository.save(roster);
    }
    
    public List<RotationRoster> getRosterForRotation(UUID rotationId) {
        return rosterRepository.findByRotationId(rotationId);
    }
    
    @Transactional
    public RotationRoster gradeRoster(UUID rosterId, Integer grade, String feedback) {
        RotationRoster roster = rosterRepository.findById(rosterId).orElseThrow();
        roster.setGrade(grade);
        roster.setSupervisorFeedback(feedback);
        roster.setStatus("COMPLETED");
        return rosterRepository.save(roster);
    }
}
