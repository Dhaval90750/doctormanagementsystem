package com.dsms.backend.controller;

import com.dsms.backend.dto.ClinicalRotationDto;
import com.dsms.backend.dto.RotationRosterDto;
import com.dsms.backend.service.ClinicalRotationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rotations")
public class ClinicalRotationController {

    private final ClinicalRotationService rotationService;

    public ClinicalRotationController(ClinicalRotationService rotationService) {
        this.rotationService = rotationService;
    }

    @PostMapping
    public ResponseEntity<?> createRotation(@RequestBody ClinicalRotationDto dto) {
        return ResponseEntity.ok(Map.of("success", true, "data", rotationService.createRotation(dto)));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<?> getRotationsByDepartment(@PathVariable UUID departmentId) {
        return ResponseEntity.ok(Map.of("success", true, "data", rotationService.getRotationsByDepartment(departmentId)));
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignStudent(@RequestBody RotationRosterDto dto) {
        return ResponseEntity.ok(Map.of("success", true, "data", rotationService.assignStudent(dto)));
    }

    @GetMapping("/{rotationId}/roster")
    public ResponseEntity<?> getRotationRoster(@PathVariable UUID rotationId) {
        return ResponseEntity.ok(Map.of("success", true, "data", rotationService.getRosterForRotation(rotationId)));
    }

    @PostMapping("/roster/{rosterId}/grade")
    public ResponseEntity<?> gradeRoster(
            @PathVariable UUID rosterId, 
            @RequestBody Map<String, Object> body) {
        Integer grade = (Integer) body.get("grade");
        String feedback = (String) body.get("feedback");
        return ResponseEntity.ok(Map.of("success", true, "data", rotationService.gradeRoster(rosterId, grade, feedback)));
    }
}
