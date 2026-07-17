package com.dsms.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@CrossOrigin(origins = "*")
public class WebRtcSignalingController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ExecutorService executor = Executors.newCachedThreadPool();

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
    
    @GetMapping("/api/v1/webrtc/transcription/{classId}")
    public SseEmitter streamLiveTranscription(@PathVariable String classId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Infinite timeout for live class
        
        executor.execute(() -> {
            try {
                String[] mockSentences = {
                    "Welcome to today's clinical anatomy class.",
                    "Today we will be discussing the cardiovascular system.",
                    "As you can see on the diagram, the heart has four main chambers.",
                    "The right atrium receives deoxygenated blood from the body.",
                    "It then pumps it into the right ventricle.",
                    "Are there any questions so far?",
                    "Please make sure you review Chapter 4 for the upcoming assignment."
                };
                
                for (String sentence : mockSentences) {
                    emitter.send(SseEmitter.event().name("transcription").data(sentence));
                    Thread.sleep(5000 + (long)(Math.random() * 5000));
                }
                emitter.complete();
            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        });
        
        return emitter;
    }
}
