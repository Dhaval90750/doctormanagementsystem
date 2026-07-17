package com.dsms.backend.service;

import com.dsms.backend.domain.Department;
import com.dsms.backend.domain.Syllabus;
import com.dsms.backend.domain.Topic;
import com.dsms.backend.dto.SyllabusDto;
import com.dsms.backend.dto.TopicDto;
import com.dsms.backend.repository.DepartmentRepository;
import com.dsms.backend.repository.SyllabusRepository;
import com.dsms.backend.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SyllabusService {

    private final SyllabusRepository syllabusRepository;
    private final TopicRepository topicRepository;
    private final DepartmentRepository departmentRepository;

    public SyllabusService(SyllabusRepository syllabusRepository, TopicRepository topicRepository, DepartmentRepository departmentRepository) {
        this.syllabusRepository = syllabusRepository;
        this.topicRepository = topicRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional
    public Syllabus createSyllabus(SyllabusDto dto) {
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Syllabus syllabus = new Syllabus();
        syllabus.setDepartment(dept);
        syllabus.setCourseName(dto.getCourseName());
        syllabus.setYearOrSemester(dto.getYearOrSemester());
        syllabus.setDescription(dto.getDescription());
        
        List<Topic> topics = new ArrayList<>();
        if (dto.getTopics() != null) {
            for (TopicDto tDto : dto.getTopics()) {
                Topic topic = new Topic();
                topic.setTitle(tDto.getTitle());
                topic.setDescription(tDto.getDescription());
                topic.setEstimatedHours(tDto.getEstimatedHours());
                topic.setSyllabus(syllabus);
                topics.add(topic);
            }
        }
        syllabus.setTopics(topics);

        return syllabusRepository.save(syllabus);
    }

    public List<Syllabus> getSyllabusByDepartment(UUID departmentId) {
        return syllabusRepository.findByDepartmentId(departmentId);
    }
}
