package com.dsms.backend.controller;

import com.dsms.backend.domain.Department;
import com.dsms.backend.dto.DepartmentDto;
import com.dsms.backend.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/departments")
@PreAuthorize("hasAuthority('SUPER_ADMIN') or hasAuthority('INSTITUTION_ADMIN')")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody DepartmentDto dto) {
        try {
            Department dept = departmentService.createDepartment(dto);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", dept
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", Map.of("message", e.getMessage())
            ));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllDepartments() {
        List<Department> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", departments
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDepartment(@PathVariable UUID id) {
        Department dept = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", dept
        ));
    }
}
