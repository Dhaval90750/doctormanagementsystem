package com.dsms.backend.controller;

import com.dsms.backend.dto.VideoAssetDto;
import com.dsms.backend.service.VideoAssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/videos")
public class VideoAssetController {

    private final VideoAssetService videoService;

    public VideoAssetController(VideoAssetService videoService) {
        this.videoService = videoService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadVideo(@RequestBody VideoAssetDto dto, @RequestHeader("X-User-ID") UUID userId) {
        return ResponseEntity.ok(Map.of("success", true, "data", videoService.uploadVideo(dto, userId)));
    }

    @GetMapping
    public ResponseEntity<?> getAllVideos() {
        return ResponseEntity.ok(Map.of("success", true, "data", videoService.getAllVideos()));
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<?> getVideosByTopic(@PathVariable UUID topicId) {
        return ResponseEntity.ok(Map.of("success", true, "data", videoService.getVideosByTopic(topicId)));
    }
}
