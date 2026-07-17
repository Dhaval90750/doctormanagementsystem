package com.dsms.backend.controller;

import com.dsms.backend.domain.TimetableEntry;
import com.dsms.backend.dto.TimetableEntryDto;
import com.dsms.backend.service.TimetableService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/timetable")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @PostMapping
    public ResponseEntity<?> createEntry(@RequestBody TimetableEntryDto dto) {
        try {
            TimetableEntry entry = timetableService.createEntry(dto);
            return ResponseEntity.ok(Map.of("success", true, "data", entry));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<?> getFacultySchedule(
            @PathVariable UUID facultyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime end) {
        
        List<TimetableEntry> schedule = timetableService.getFacultySchedule(facultyId, start, end);
        return ResponseEntity.ok(Map.of("success", true, "data", schedule));
    }
}
