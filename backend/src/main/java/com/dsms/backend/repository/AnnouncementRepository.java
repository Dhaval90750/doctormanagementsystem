package com.dsms.backend.repository;

import com.dsms.backend.domain.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, UUID> {
    List<Announcement> findByTargetRoleIsNullAndTargetDepartmentIdIsNullOrderByCreatedAtDesc();
    List<Announcement> findByTargetRoleOrTargetRoleIsNullOrderByCreatedAtDesc(String targetRole);
}
