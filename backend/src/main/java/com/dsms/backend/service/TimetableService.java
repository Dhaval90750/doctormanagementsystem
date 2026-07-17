package com.dsms.backend.service;

import com.dsms.backend.domain.TimetableEntry;
import com.dsms.backend.dto.TimetableEntryDto;
import com.dsms.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TimetableService {

    private final TimetableEntryRepository timetableEntryRepository;
    private final DepartmentRepository departmentRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final FacilityRepository facilityRepository;

    public TimetableService(TimetableEntryRepository timetableEntryRepository, DepartmentRepository departmentRepository, TopicRepository topicRepository, UserRepository userRepository, FacilityRepository facilityRepository) {
        this.timetableEntryRepository = timetableEntryRepository;
        this.departmentRepository = departmentRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
        this.facilityRepository = facilityRepository;
    }

    public TimetableEntry createEntry(TimetableEntryDto dto) {
        TimetableEntry entry = new TimetableEntry();
        
        if (dto.getDepartmentId() != null) {
            entry.setDepartment(departmentRepository.findById(dto.getDepartmentId()).orElse(null));
        }
        if (dto.getTopicId() != null) {
            entry.setTopic(topicRepository.findById(dto.getTopicId()).orElse(null));
        }
        if (dto.getFacultyId() != null) {
            entry.setFaculty(userRepository.findById(dto.getFacultyId()).orElse(null));
        }
        if (dto.getFacilityId() != null) {
            entry.setFacility(facilityRepository.findById(dto.getFacilityId()).orElse(null));
        }
        
        entry.setSessionType(dto.getSessionType());
        entry.setStartTime(dto.getStartTime());
        entry.setEndTime(dto.getEndTime());
        entry.setBatchYear(dto.getBatchYear());

        // Check for conflicts
        if (dto.getFacultyId() != null) {
            if (timetableEntryRepository.countFacultyConflicts(dto.getFacultyId(), dto.getStartTime(), dto.getEndTime()) > 0) {
                throw new IllegalStateException("Conflict: Faculty is already scheduled during this time.");
            }
        }
        
        if (dto.getFacilityId() != null) {
            if (timetableEntryRepository.countFacilityConflicts(dto.getFacilityId(), dto.getStartTime(), dto.getEndTime()) > 0) {
                throw new IllegalStateException("Conflict: Facility is already booked during this time.");
            }
        }
        
        if (dto.getBatchYear() != null) {
            if (timetableEntryRepository.countBatchConflicts(dto.getBatchYear(), dto.getStartTime(), dto.getEndTime()) > 0) {
                throw new IllegalStateException("Conflict: Student batch is already scheduled during this time.");
            }
        }

        return timetableEntryRepository.save(entry);
    }

    public List<TimetableEntry> getFacultySchedule(UUID facultyId, ZonedDateTime start, ZonedDateTime end) {
        return timetableEntryRepository.findByFacultyIdAndStartTimeBetween(facultyId, start, end);
    }
}
