package com.dsms.backend.controller;

import com.dsms.backend.domain.StudentGamification;
import com.dsms.backend.service.GamificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/gamification")
public class GamificationController {

    private final GamificationService gamificationService;

    public GamificationController(GamificationService gamificationService) {
        this.gamificationService = gamificationService;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getGamificationStats(@PathVariable UUID studentId) {
        Optional<StudentGamification> stats = gamificationService.getGamificationStats(studentId);
        if (stats.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "data", stats.get()));
        } else {
            return ResponseEntity.ok(Map.of("success", true, "data", Map.of(
                "totalXp", 0,
                "currentStreak", 0,
                "longestStreak", 0
            )));
        }
    }
}
