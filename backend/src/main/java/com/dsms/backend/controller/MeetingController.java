package com.dsms.backend.controller;

import com.dsms.backend.domain.Meeting;
import com.dsms.backend.dto.MeetingDto;
import com.dsms.backend.service.MeetingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/meetings")
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @PostMapping
    public ResponseEntity<?> createMeeting(@RequestBody MeetingDto dto) {
        try {
            Meeting meeting = meetingService.createMeeting(dto);
            return ResponseEntity.ok(Map.of("success", true, "data", meeting));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllMeetings() {
        List<Meeting> meetings = meetingService.getAllMeetings();
        return ResponseEntity.ok(Map.of("success", true, "data", meetings));
    }
}
