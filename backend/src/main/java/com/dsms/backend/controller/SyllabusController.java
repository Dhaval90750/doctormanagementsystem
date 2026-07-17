package com.dsms.backend.controller;

import com.dsms.backend.domain.Syllabus;
import com.dsms.backend.dto.SyllabusDto;
import com.dsms.backend.service.SyllabusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/syllabus")
public class SyllabusController {

    private final SyllabusService syllabusService;

    public SyllabusController(SyllabusService syllabusService) {
        this.syllabusService = syllabusService;
    }

    @PostMapping
    public ResponseEntity<?> createSyllabus(@RequestBody SyllabusDto dto) {
        try {
            Syllabus syllabus = syllabusService.createSyllabus(dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", syllabus
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", Map.of("message", e.getMessage())
            ));
        }
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<?> getSyllabusByDepartment(@PathVariable UUID departmentId) {
        List<Syllabus> syllabusList = syllabusService.getSyllabusByDepartment(departmentId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", syllabusList
        ));
    }
}
