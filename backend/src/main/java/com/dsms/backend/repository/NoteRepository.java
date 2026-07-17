package com.dsms.backend.repository;

import com.dsms.backend.domain.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {
    List<Note> findByAuthorIdOrderByUpdatedAtDesc(UUID authorId);
    List<Note> findByTopicIdAndIsPublicTrueOrderByUpdatedAtDesc(UUID topicId);
}
