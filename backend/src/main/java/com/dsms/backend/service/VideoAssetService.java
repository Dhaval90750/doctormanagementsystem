package com.dsms.backend.service;

import com.dsms.backend.domain.VideoAsset;
import com.dsms.backend.dto.VideoAssetDto;
import com.dsms.backend.repository.TopicRepository;
import com.dsms.backend.repository.UserRepository;
import com.dsms.backend.repository.VideoAssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class VideoAssetService {

    private final VideoAssetRepository videoRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public VideoAssetService(VideoAssetRepository videoRepository, 
                             TopicRepository topicRepository, 
                             UserRepository userRepository) {
        this.videoRepository = videoRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public VideoAsset uploadVideo(VideoAssetDto dto, UUID uploadedBy) {
        VideoAsset video = new VideoAsset();
        video.setTitle(dto.getTitle());
        video.setDescription(dto.getDescription());
        video.setOriginalFileUrl(dto.getOriginalFileUrl());
        video.setStatus("PROCESSING");
        
        if (dto.getTopicId() != null) {
            video.setTopic(topicRepository.findById(dto.getTopicId()).orElse(null));
        }
        
        video.setUploadedBy(userRepository.findById(uploadedBy).orElseThrow());
        
        // Mock FFmpeg transcoding pipeline trigger
        video = videoRepository.save(video);
        simulateFfmpegTranscoding(video.getId());
        
        return video;
    }
    
    public List<VideoAsset> getVideosByTopic(UUID topicId) {
        return videoRepository.findByTopicId(topicId);
    }
    
    public List<VideoAsset> getAllVideos() {
        return videoRepository.findAll();
    }
    
    private void simulateFfmpegTranscoding(UUID videoId) {
        // In a real app, this would send a message to a RabbitMQ/Kafka queue
        // which a worker node running FFmpeg would pick up.
        // For our mock, we just start a background thread that updates the status after 5 seconds.
        new Thread(() -> {
            try {
                Thread.sleep(5000); // Simulate processing time
                VideoAsset v = videoRepository.findById(videoId).orElse(null);
                if (v != null) {
                    v.setStatus("READY");
                    v.setHlsPlaylistUrl("https://mock-streaming-server.com/hls/" + videoId + "/master.m3u8");
                    v.setThumbnailUrl("https://mock-streaming-server.com/thumbnails/" + videoId + ".jpg");
                    v.setDurationSeconds(120L); // Mock duration
                    videoRepository.save(v);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
}
