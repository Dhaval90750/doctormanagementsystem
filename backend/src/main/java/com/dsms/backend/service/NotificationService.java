package com.dsms.backend.service;

import com.dsms.backend.domain.Notification;
import com.dsms.backend.domain.User;
import com.dsms.backend.dto.NotificationDto;
import com.dsms.backend.repository.NotificationRepository;
import com.dsms.backend.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Notification createAndSendNotification(NotificationDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(dto.getTitle());
        notification.setMessage(dto.getMessage());
        notification.setType(dto.getType());

        Notification saved = notificationRepository.save(notification);

        // Send over WebSocket to specific user queue
        messagingTemplate.convertAndSendToUser(
                user.getId().toString(),
                "/queue/notifications",
                saved
        );

        return saved;
    }

    public List<Notification> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
