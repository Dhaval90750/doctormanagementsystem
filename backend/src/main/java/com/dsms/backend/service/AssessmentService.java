package com.dsms.backend.service;

import com.dsms.backend.domain.Assessment;
import com.dsms.backend.domain.AssessmentResult;
import com.dsms.backend.domain.User;
import com.dsms.backend.dto.AssessmentDto;
import com.dsms.backend.dto.AssessmentResultBatchDto;
import com.dsms.backend.repository.AssessmentRepository;
import com.dsms.backend.repository.AssessmentResultRepository;
import com.dsms.backend.repository.DepartmentRepository;
import com.dsms.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentResultRepository resultRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public AssessmentService(AssessmentRepository assessmentRepository, AssessmentResultRepository resultRepository, DepartmentRepository departmentRepository, UserRepository userRepository) {
        this.assessmentRepository = assessmentRepository;
        this.resultRepository = resultRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Assessment createAssessment(AssessmentDto dto) {
        Assessment assessment = new Assessment();
        if (dto.getDepartmentId() != null) {
            assessment.setDepartment(departmentRepository.findById(dto.getDepartmentId()).orElse(null));
        }
        if (dto.getConductedBy() != null) {
            assessment.setConductedBy(userRepository.findById(dto.getConductedBy()).orElse(null));
        }
        assessment.setTitle(dto.getTitle());
        assessment.setAssessmentType(dto.getAssessmentType());
        assessment.setMaxMarks(dto.getMaxMarks());
        assessment.setAssessmentDate(dto.getAssessmentDate());

        return assessmentRepository.save(assessment);
    }

    public List<Assessment> getAssessmentsByDepartment(UUID departmentId) {
        return assessmentRepository.findByDepartmentId(departmentId);
    }

    @Transactional
    public void submitResults(AssessmentResultBatchDto batchDto) {
        Assessment assessment = assessmentRepository.findById(batchDto.getAssessmentId())
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        List<AssessmentResult> entities = new ArrayList<>();
        for (AssessmentResultBatchDto.ResultEntry entry : batchDto.getResults()) {
            User student = userRepository.findById(entry.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            AssessmentResult result = new AssessmentResult();
            result.setAssessment(assessment);
            result.setStudent(student);
            result.setMarksObtained(entry.getMarksObtained());
            result.setRemarks(entry.getRemarks());
            result.setAbsent(entry.isAbsent());
            entities.add(result);
        }
        
        resultRepository.saveAll(entities);
    }

    public List<AssessmentResult> getResults(UUID assessmentId) {
        return resultRepository.findByAssessmentId(assessmentId);
    }
}
