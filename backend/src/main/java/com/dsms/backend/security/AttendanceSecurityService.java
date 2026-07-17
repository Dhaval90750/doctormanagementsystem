package com.dsms.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Service
public class AttendanceSecurityService {

    private final String secretKey;

    public AttendanceSecurityService(@Value("${jwt.secret}") String secretKey) {
        this.secretKey = secretKey;
    }

    public String generateSecureQrToken(UUID sessionId, int validitySeconds) {
        long expiryTime = Instant.now().getEpochSecond() + validitySeconds;
        String payload = sessionId.toString() + ":" + expiryTime;
        String signature = generateHmacSha256(payload, secretKey);
        
        // Return base64 encoded token: payload.signature
        String rawToken = payload + "." + signature;
        return Base64.getUrlEncoder().withoutPadding().encodeToString(rawToken.getBytes(StandardCharsets.UTF_8));
    }

    public boolean validateQrToken(String token, UUID expectedSessionId) {
        try {
            String decoded = new String(Base64.getUrlDecoder().decode(token), StandardCharsets.UTF_8);
            String[] parts = decoded.split("\\.");
            if (parts.length != 2) return false;

            String payload = parts[0];
            String signature = parts[1];

            // Verify signature
            String expectedSignature = generateHmacSha256(payload, secretKey);
            if (!expectedSignature.equals(signature)) return false;

            // Verify payload parts
            String[] payloadParts = payload.split(":");
            if (payloadParts.length != 2) return false;

            UUID sessionId = UUID.fromString(payloadParts[0]);
            long expiryTime = Long.parseLong(payloadParts[1]);

            // Check session matches
            if (!sessionId.equals(expectedSessionId)) return false;

            // Check expiry
            if (Instant.now().getEpochSecond() > expiryTime) return false;

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String generateHmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hmacBytes);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to generate HMAC", e);
        }
    }
}
