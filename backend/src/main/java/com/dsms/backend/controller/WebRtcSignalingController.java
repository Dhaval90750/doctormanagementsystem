package com.dsms.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import java.util.Map;

@Controller
public class WebRtcSignalingController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebRtcSignalingController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/webrtc/signal")
    public void processSignal(@Payload Map<String, Object> message) {
        String targetUserId = (String) message.get("targetUserId");
        if (targetUserId != null) {
            // Forward the signaling message (offer, answer, ice-candidate) to the specific user
            messagingTemplate.convertAndSendToUser(
                    targetUserId,
                    "/queue/webrtc",
                    message
            );
        }
    }
}
