package com.dsms.backend.controller;

import com.dsms.backend.domain.Note;
import com.dsms.backend.dto.NoteDto;
import com.dsms.backend.service.NoteService;
import com.dsms.backend.annotation.AuditAction;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    @AuditAction(action = "CREATE", entityName = "Note")
    public ResponseEntity<?> createNote(@RequestBody NoteDto dto, @RequestHeader("X-User-ID") UUID userId) {
        // In a real app we get userId from SecurityContext, but passing in header for simplicity here
        try {
            Note note = noteService.createNote(dto, userId);
            return ResponseEntity.ok(Map.of("success", true, "data", note));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", Map.of("message", e.getMessage())));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyNotes(@RequestHeader("X-User-ID") UUID userId) {
        List<Note> notes = noteService.getMyNotes(userId);
        return ResponseEntity.ok(Map.of("success", true, "data", notes));
    }
    
    @GetMapping("/topic/{topicId}")
    public ResponseEntity<?> getPublicNotesByTopic(@PathVariable UUID topicId) {
        List<Note> notes = noteService.getPublicNotesByTopic(topicId);
        return ResponseEntity.ok(Map.of("success", true, "data", notes));
    }
}
