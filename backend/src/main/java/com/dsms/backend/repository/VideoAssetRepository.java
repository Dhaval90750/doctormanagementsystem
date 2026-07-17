package com.dsms.backend.repository;

import com.dsms.backend.domain.VideoAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VideoAssetRepository extends JpaRepository<VideoAsset, UUID> {
    List<VideoAsset> findByTopicId(UUID topicId);
    List<VideoAsset> findByStatus(String status);
}
