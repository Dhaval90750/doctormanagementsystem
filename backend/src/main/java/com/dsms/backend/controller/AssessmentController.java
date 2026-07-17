package com.dsms.backend.controller;

import com.dsms.backend.domain.Assessment;
import com.dsms.backend.domain.AssessmentResult;
import com.dsms.backend.dto.AssessmentDto;
import com.dsms.backend.dto.AssessmentResultBatchDto;
import com.dsms.backend.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping
    public ResponseEntity<?> createAssessment(@RequestBody AssessmentDto dto) {
        try {
            Assessment assessment = assessmentService.createAssessment(dto);
            return ResponseEntity.ok(Map.of("success", true, "data", assessment));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<?> getAssessments(@PathVariable UUID departmentId) {
        List<Assessment> list = assessmentService.getAssessmentsByDepartment(departmentId);
        return ResponseEntity.ok(Map.of("success", true, "data", list));
    }

    @PostMapping("/results")
    public ResponseEntity<?> submitResults(@RequestBody AssessmentResultBatchDto dto) {
        try {
            assessmentService.submitResults(dto);
            return ResponseEntity.ok(Map.of("success", true, "message", "Results saved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @GetMapping("/{id}/results")
    public ResponseEntity<?> getResults(@PathVariable UUID id) {
        List<AssessmentResult> results = assessmentService.getResults(id);
        return ResponseEntity.ok(Map.of("success", true, "data", results));
    }
}
