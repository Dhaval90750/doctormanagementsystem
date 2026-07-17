package com.dsms.backend.service;

import com.dsms.backend.domain.Meeting;
import com.dsms.backend.domain.MeetingAttendee;
import com.dsms.backend.domain.User;
import com.dsms.backend.dto.MeetingDto;
import com.dsms.backend.repository.MeetingRepository;
import com.dsms.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    public MeetingService(MeetingRepository meetingRepository, UserRepository userRepository) {
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Meeting createMeeting(MeetingDto dto) {
        Meeting meeting = new Meeting();
        meeting.setTitle(dto.getTitle());
        meeting.setDescription(dto.getDescription());
        meeting.setStartTime(dto.getStartTime());
        meeting.setEndTime(dto.getEndTime());
        meeting.setLocationOrLink(dto.getLocationOrLink());
        
        if (dto.getOrganizerId() != null) {
            meeting.setOrganizer(userRepository.findById(dto.getOrganizerId()).orElse(null));
        }
        
        Meeting savedMeeting = meetingRepository.save(meeting);
        
        // Handling attendees would be done via another repository or cascading.
        // For simplicity in this demo, we'll assume basic meeting creation works.
        
        return savedMeeting;
    }

    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAll();
    }
}
