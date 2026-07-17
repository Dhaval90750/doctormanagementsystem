package com.dsms.backend.service;

import com.dsms.backend.domain.Note;
import com.dsms.backend.dto.NoteDto;
import com.dsms.backend.repository.NoteRepository;
import com.dsms.backend.repository.TopicRepository;
import com.dsms.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository, TopicRepository topicRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.topicRepository = topicRepository;
    }

    public Note createNote(NoteDto dto, UUID authorId) {
        Note note = new Note();
        note.setTitle(dto.getTitle());
        note.setContent(dto.getContent());
        note.setPublic(dto.isPublic());
        
        note.setAuthor(userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Author not found")));
        
        if (dto.getTopicId() != null) {
            note.setTopic(topicRepository.findById(dto.getTopicId()).orElse(null));
        }

        return noteRepository.save(note);
    }

    public List<Note> getMyNotes(UUID authorId) {
        return noteRepository.findByAuthorIdOrderByUpdatedAtDesc(authorId);
    }

    public List<Note> getPublicNotesByTopic(UUID topicId) {
        return noteRepository.findByTopicIdAndIsPublicTrueOrderByUpdatedAtDesc(topicId);
    }
}
