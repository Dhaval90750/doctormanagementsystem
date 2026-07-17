package com.dsms.backend.controller;

import com.dsms.backend.domain.Attendance;
import com.dsms.backend.dto.AttendanceDto;
import com.dsms.backend.service.AttendanceService;
import com.dsms.backend.security.AttendanceSecurityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final AttendanceSecurityService qrSecurityService;

    public AttendanceController(AttendanceService attendanceService, AttendanceSecurityService qrSecurityService) {
        this.attendanceService = attendanceService;
        this.qrSecurityService = qrSecurityService;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SUPER_ADMIN') or hasAuthority('HOD') or hasAuthority('SENIOR_DOCTOR')")
    public ResponseEntity<?> markAttendance(@RequestBody AttendanceDto dto) {
        try {
            Attendance attendance = attendanceService.markAttendance(dto);
            return ResponseEntity.ok(Map.of("success", true, "data", attendance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<?> getSessionAttendance(@PathVariable UUID sessionId) {
        List<Attendance> attendances = attendanceService.getAttendanceBySession(sessionId);
        return ResponseEntity.ok(Map.of("success", true, "data", attendances));
    }
    
    @GetMapping("/qr/generate/{sessionId}")
    @PreAuthorize("hasAuthority('SENIOR_DOCTOR')")
    public ResponseEntity<?> generateQrToken(@PathVariable UUID sessionId) {
        // Token valid for 30 seconds
        String token = qrSecurityService.generateSecureQrToken(sessionId, 30);
        return ResponseEntity.ok(Map.of("success", true, "data", Map.of("token", token)));
    }
    
    @PostMapping("/qr/scan")
    @PreAuthorize("hasAuthority('STUDENT_UG') or hasAuthority('STUDENT_INTERN')")
    public ResponseEntity<?> scanQrAttendance(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String sessionIdStr = request.get("sessionId");
        String studentIdStr = request.get("studentId"); // Should Ideally come from JWT/SecurityContext
        
        if (token == null || sessionIdStr == null || studentIdStr == null) {
             return ResponseEntity.badRequest().body(Map.of("success", false, "error", Map.of("message", "Missing fields")));
        }
        
        UUID sessionId = UUID.fromString(sessionIdStr);
        UUID studentId = UUID.fromString(studentIdStr);
        
        boolean isValid = qrSecurityService.validateQrToken(token, sessionId);
        
        if (!isValid) {
            return ResponseEntity.status(403).body(Map.of("success", false, "error", Map.of("message", "Invalid or expired QR code")));
        }
        
        // Mark attendance since token is valid
        AttendanceDto dto = new AttendanceDto();
        dto.setTimetableEntryId(sessionId);
        dto.setStudentId(studentId);
        dto.setStatus("PRESENT");
        
        try {
            Attendance attendance = attendanceService.markAttendance(dto);
            return ResponseEntity.ok(Map.of("success", true, "data", attendance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }
}
