package com.dsms.backend.controller;

import com.dsms.backend.domain.Announcement;
import com.dsms.backend.dto.AnnouncementDto;
import com.dsms.backend.service.AnnouncementService;
import com.dsms.backend.annotation.AuditAction;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/announcements")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SUPER_ADMIN') or hasAuthority('INSTITUTION_ADMIN')")
    @AuditAction(action = "CREATE", entityName = "Announcement")
    public ResponseEntity<?> createAnnouncement(@RequestBody AnnouncementDto dto) {
        try {
            Announcement ann = announcementService.createAnnouncement(dto);
            return ResponseEntity.ok(Map.of("success", true, "data", ann));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAnnouncements(@RequestParam(required = false) String role) {
        List<Announcement> announcements = announcementService.getAnnouncementsForRole(role);
        return ResponseEntity.ok(Map.of("success", true, "data", announcements));
    }
}
