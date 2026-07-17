package com.dsms.backend.service;

import com.dsms.backend.domain.Announcement;
import com.dsms.backend.dto.AnnouncementDto;
import com.dsms.backend.repository.AnnouncementRepository;
import com.dsms.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository, UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.userRepository = userRepository;
    }

    public Announcement createAnnouncement(AnnouncementDto dto) {
        Announcement ann = new Announcement();
        ann.setTitle(dto.getTitle());
        ann.setContent(dto.getContent());
        ann.setTargetRole(dto.getTargetRole());
        ann.setTargetDepartmentId(dto.getTargetDepartmentId());
        
        if (dto.getCreatedById() != null) {
            ann.setCreatedBy(userRepository.findById(dto.getCreatedById()).orElse(null));
        }

        return announcementRepository.save(ann);
    }

    public List<Announcement> getAnnouncementsForRole(String role) {
        if (role == null || role.isEmpty()) {
            return announcementRepository.findByTargetRoleIsNullAndTargetDepartmentIdIsNullOrderByCreatedAtDesc();
        }
        return announcementRepository.findByTargetRoleOrTargetRoleIsNullOrderByCreatedAtDesc(role);
    }
    
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }
}
