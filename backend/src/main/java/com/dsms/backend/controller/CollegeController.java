package com.dsms.backend.controller;

import com.dsms.backend.domain.College;
import com.dsms.backend.dto.CollegeDto;
import com.dsms.backend.service.CollegeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/colleges")
@PreAuthorize("hasAuthority('SUPER_ADMIN')")
public class CollegeController {

    private final CollegeService collegeService;

    public CollegeController(CollegeService collegeService) {
        this.collegeService = collegeService;
    }

    @PostMapping
    public ResponseEntity<?> registerCollege(@RequestBody CollegeDto dto) {
        try {
            College college = collegeService.createCollege(dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", college
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", Map.of("message", e.getMessage())
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllColleges() {
        List<College> colleges = collegeService.getAllColleges();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", colleges
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCollege(@PathVariable UUID id) {
        College college = collegeService.getCollegeById(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", college
        ));
    }
}
