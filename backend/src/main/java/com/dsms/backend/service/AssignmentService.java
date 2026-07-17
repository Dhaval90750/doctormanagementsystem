package com.dsms.backend.service;

import com.dsms.backend.domain.Assignment;
import com.dsms.backend.domain.AssignmentSubmission;
import com.dsms.backend.dto.AssignmentDto;
import com.dsms.backend.dto.AssignmentSubmissionDto;
import com.dsms.backend.repository.AssignmentRepository;
import com.dsms.backend.repository.AssignmentSubmissionRepository;
import com.dsms.backend.repository.TopicRepository;
import com.dsms.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public AssignmentService(AssignmentRepository assignmentRepository, 
                             AssignmentSubmissionRepository submissionRepository,
                             TopicRepository topicRepository, 
                             UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Assignment createAssignment(AssignmentDto dto, UUID facultyId) {
        Assignment assignment = new Assignment();
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDueDate(dto.getDueDate());
        assignment.setMaxMarks(dto.getMaxMarks());
        assignment.setTopic(topicRepository.findById(dto.getTopicId()).orElseThrow());
        assignment.setCreatedBy(userRepository.findById(facultyId).orElseThrow());
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAssignmentsByFaculty(UUID facultyId) {
        return assignmentRepository.findByCreatedById(facultyId);
    }
    
    public List<Assignment> getAssignmentsByTopic(UUID topicId) {
        return assignmentRepository.findByTopicId(topicId);
    }

    @Transactional
    public AssignmentSubmission submitAssignment(AssignmentSubmissionDto dto, UUID studentId) {
        AssignmentSubmission submission = submissionRepository
                .findByAssignmentIdAndStudentId(dto.getAssignmentId(), studentId)
                .orElse(new AssignmentSubmission());
                
        submission.setAssignment(assignmentRepository.findById(dto.getAssignmentId()).orElseThrow());
        submission.setStudent(userRepository.findById(studentId).orElseThrow());
        submission.setContent(dto.getContent());
        submission.setFileUrl(dto.getFileUrl());
        
        return submissionRepository.save(submission);
    }
    
    @Transactional
    public AssignmentSubmission gradeSubmission(UUID submissionId, Integer marks, String feedback) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId).orElseThrow();
        submission.setMarksAwarded(marks);
        submission.setFeedback(feedback);
        return submissionRepository.save(submission);
    }
    
    public List<AssignmentSubmission> getSubmissionsForAssignment(UUID assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }
    
    public List<AssignmentSubmission> getSubmissionsForStudent(UUID studentId) {
        return submissionRepository.findByStudentId(studentId);
    }
}
