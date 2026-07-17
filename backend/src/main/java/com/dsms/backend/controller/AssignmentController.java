package com.dsms.backend.controller;

import com.dsms.backend.domain.Assignment;
import com.dsms.backend.domain.AssignmentSubmission;
import com.dsms.backend.dto.AssignmentDto;
import com.dsms.backend.dto.AssignmentSubmissionDto;
import com.dsms.backend.service.AssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody AssignmentDto dto, @RequestHeader("X-User-ID") UUID userId) {
        return ResponseEntity.ok(Map.of("success", true, "data", assignmentService.createAssignment(dto, userId)));
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<?> getFacultyAssignments(@PathVariable UUID facultyId) {
        return ResponseEntity.ok(Map.of("success", true, "data", assignmentService.getAssignmentsByFaculty(facultyId)));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitAssignment(@RequestBody AssignmentSubmissionDto dto, @RequestHeader("X-User-ID") UUID studentId) {
        return ResponseEntity.ok(Map.of("success", true, "data", assignmentService.submitAssignment(dto, studentId)));
    }

    @PostMapping("/grade/{submissionId}")
    public ResponseEntity<?> gradeSubmission(
            @PathVariable UUID submissionId, 
            @RequestBody Map<String, Object> body) {
        Integer marks = (Integer) body.get("marks");
        String feedback = (String) body.get("feedback");
        return ResponseEntity.ok(Map.of("success", true, "data", assignmentService.gradeSubmission(submissionId, marks, feedback)));
    }
}
