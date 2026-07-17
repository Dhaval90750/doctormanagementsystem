# 05 — Non-Functional Requirements

> **Document Version:** 1.0.0-DRAFT  
> **Last Updated:** 2026-06-27  
> **Status:** 🟡 Draft

---

## 5.1 Performance Requirements

| ID | Requirement | Target | Priority |
|----|------------|--------|----------|
| NFR-001 | API response time for standard CRUD operations | < 200ms (95th percentile) | P0 |
| NFR-002 | API response time for complex queries (reports, analytics) | < 2 seconds | P0 |
| NFR-003 | Page load time (web — initial load) | < 3 seconds on 4G connection | P0 |
| NFR-004 | Page load time (web — subsequent navigation) | < 1 second (SPA routing) | P0 |
| NFR-005 | Mobile app cold start time | < 3 seconds | P1 |
| NFR-006 | Video call setup time (time to first frame) | < 5 seconds on broadband | P0 |
| NFR-007 | Video streaming start time | < 3 seconds (adaptive bitrate) | P0 |
| NFR-008 | Search results returned | < 500ms for standard queries | P0 |
| NFR-009 | File upload speed | Support up to 50 Mbps per user | P1 |
| NFR-010 | Notification delivery | < 5 seconds for push notifications | P0 |
| NFR-011 | Live transcription latency | < 3 seconds from speech to text | P1 |
| NFR-012 | QR code attendance scan response | < 2 seconds | P0 |

---

## 5.2 Scalability Requirements

| ID | Requirement | Target | Priority |
|----|------------|--------|----------|
| NFR-020 | Concurrent users per institution | 500+ | P0 |
| NFR-021 | Total registered users (platform-wide) | 100,000+ | P1 |
| NFR-022 | Concurrent video conference participants | 50 per room (200+ for webinar mode) | P0 |
| NFR-023 | Simultaneous video conference rooms | 20+ per institution | P1 |
| NFR-024 | Concurrent video stream viewers | 500+ per video | P1 |
| NFR-025 | Total stored videos | 10,000+ per institution | P1 |
| NFR-026 | Storage per institution | Up to 5 TB (configurable) | P1 |
| NFR-027 | Number of colleges on platform | 50+ | P2 |
| NFR-028 | Database records | 10M+ records without degradation | P1 |
| NFR-029 | Horizontal scaling | System SHALL scale horizontally by adding app server instances | P1 |
| NFR-030 | Video transcoding | Process up to 10 videos concurrently per institution | P1 |

---

## 5.3 Availability & Reliability

| ID | Requirement | Target | Priority |
|----|------------|--------|----------|
| NFR-040 | System uptime | 99.5% during academic hours (8 AM - 10 PM) | P0 |
| NFR-041 | Planned maintenance window | Maximum 2 hours, outside academic hours, with 48h notice | P0 |
| NFR-042 | Recovery Time Objective (RTO) | < 1 hour for critical systems | P0 |
| NFR-043 | Recovery Point Objective (RPO) | < 15 minutes (max data loss in disaster) | P0 |
| NFR-044 | Database backup frequency | Every 6 hours (minimum), daily full backup | P0 |
| NFR-045 | Backup retention | 30 days (daily), 12 months (monthly) | P1 |
| NFR-046 | Failover | Automatic failover for database and app servers | P1 |
| NFR-047 | Graceful degradation | Video conferencing failure SHALL NOT affect other modules | P0 |
| NFR-048 | Offline support (mobile) | View cached data, queue writes for sync | P1 |

---

## 5.4 Security Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-060 | All data in transit SHALL be encrypted using TLS 1.2+ | P0 |
| NFR-061 | All sensitive data at rest SHALL be encrypted (AES-256) | P0 |
| NFR-062 | Passwords SHALL be stored using bcrypt/scrypt/argon2 with salt | P0 |
| NFR-063 | System SHALL implement CSRF protection on all state-changing operations | P0 |
| NFR-064 | System SHALL implement XSS protection (input sanitization, CSP headers) | P0 |
| NFR-065 | System SHALL implement SQL injection prevention (parameterized queries, ORM) | P0 |
| NFR-066 | System SHALL implement rate limiting on authentication endpoints | P0 |
| NFR-067 | System SHALL implement rate limiting on API endpoints (configurable per role) | P1 |
| NFR-068 | JWT tokens SHALL have short expiry (15 min access, 7 day refresh) | P0 |
| NFR-069 | Refresh tokens SHALL be rotatable (one-time use) | P0 |
| NFR-070 | System SHALL log all security events (login, logout, failed attempts, permission changes) | P0 |
| NFR-071 | File uploads SHALL be scanned for malware | P1 |
| NFR-072 | System SHALL implement Content Security Policy (CSP) headers | P1 |
| NFR-073 | System SHALL support IP-based access restrictions (optional, admin-configurable) | P2 |
| NFR-074 | Video streams SHALL use signed URLs with expiry (prevent unauthorized access) | P0 |
| NFR-075 | System SHALL comply with OWASP Top 10 security guidelines | P0 |
| NFR-076 | System SHALL implement CORS with strict origin whitelisting | P0 |
| NFR-077 | System SHALL support two-factor authentication (TOTP) for admin roles | P1 |

---

## 5.5 Data Privacy & Compliance

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-080 | System SHALL comply with applicable data protection regulations (IT Act, DPDP Act) | P0 |
| NFR-081 | Student/faculty personal data SHALL have restricted access based on RBAC | P0 |
| NFR-082 | System SHALL support data export for individual users (data portability) | P2 |
| NFR-083 | System SHALL support data deletion requests (right to erasure) with audit trail | P2 |
| NFR-084 | Multi-college data SHALL be strictly isolated (no cross-tenant data leakage) | P0 |
| NFR-085 | Audit logs SHALL be immutable and tamper-evident | P0 |
| NFR-086 | System SHALL display privacy consent during user registration | P1 |
| NFR-087 | Recording consent SHALL be explicit (participants notified and can opt out) | P0 |

---

## 5.6 Usability Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-100 | Web app SHALL be responsive (desktop, tablet, mobile browser) | P0 |
| NFR-101 | Mobile app SHALL follow platform design guidelines (Material Design for Android, HIG for iOS) | P0 |
| NFR-102 | System SHALL support basic accessibility (WCAG 2.1 Level AA) | P1 |
| NFR-103 | System SHALL have consistent navigation across all modules | P0 |
| NFR-104 | All forms SHALL have inline validation with clear error messages | P0 |
| NFR-105 | System SHALL support dark mode (web and mobile) | P2 |
| NFR-106 | System SHALL provide contextual help/tooltips for complex features | P2 |
| NFR-107 | System SHALL provide onboarding walkthrough for new users | P2 |
| NFR-108 | Critical actions (delete, bulk operations) SHALL require confirmation | P0 |
| NFR-109 | System SHALL support undo for accidental deletions (soft delete with recovery period) | P1 |
| NFR-110 | Primary language: English. System SHALL support future localization (i18n-ready) | P1 |

---

## 5.7 Compatibility Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-120 | Web: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ | P0 |
| NFR-121 | Mobile: Android 8.0+ (API level 26) | P0 |
| NFR-122 | Mobile: iOS 15+ | P0 |
| NFR-123 | Video conferencing: WebRTC-compatible browsers (Chrome, Firefox, Safari, Edge) | P0 |
| NFR-124 | Video playback: HLS support (native in Safari, via hls.js in others) | P0 |
| NFR-125 | Responsive breakpoints: Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px) | P0 |

---

## 5.8 Maintainability & Code Quality

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-140 | Code SHALL follow established coding standards and conventions | P0 |
| NFR-141 | Backend SHALL have unit test coverage ≥ 70% for service layer | P1 |
| NFR-142 | Frontend SHALL have unit tests for critical components | P1 |
| NFR-143 | API SHALL be documented using OpenAPI/Swagger | P0 |
| NFR-144 | System SHALL use database migrations (versioned, reversible) | P0 |
| NFR-145 | System SHALL use environment-based configuration (no hardcoded secrets) | P0 |
| NFR-146 | System SHALL use structured logging (JSON format) with correlation IDs | P1 |
| NFR-147 | System SHALL support health check endpoints for monitoring | P0 |
| NFR-148 | System SHALL use containerized deployment (Docker) | P0 |
| NFR-149 | System SHALL support CI/CD pipeline integration | P1 |

---

## 5.9 Video & Media Specific Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-160 | Video conferencing SHALL use WebRTC with STUN/TURN servers | P0 |
| NFR-161 | System SHALL use SFU (Selective Forwarding Unit) architecture for group calls (NOT mesh) | P0 |
| NFR-162 | Video streams SHALL support VP8/VP9/H.264 codecs | P0 |
| NFR-163 | Audio SHALL support Opus codec for low-latency communication | P0 |
| NFR-164 | Recorded/uploaded videos SHALL be transcoded to H.264 for maximum compatibility | P0 |
| NFR-165 | Video streaming SHALL use HLS (HTTP Live Streaming) with adaptive bitrate | P0 |
| NFR-166 | Video segments SHALL be cached via CDN for performance | P1 |
| NFR-167 | Maximum video call latency (end-to-end) | < 300ms on broadband | P0 |
| NFR-168 | Echo cancellation and noise suppression SHALL be enabled by default | P0 |
| NFR-169 | System SHALL support simulcast (send multiple quality streams from publisher) | P1 |
| NFR-170 | Transcription engine SHALL support real-time streaming (WebSocket-based) | P0 |

---

## 5.10 Network & Infrastructure

| ID | Requirement | Priority |
|----|------------|----------|
| NFR-180 | System SHALL work on 3G/4G mobile networks (with degraded video quality) | P0 |
| NFR-181 | Video conferencing SHALL adapt to available bandwidth (from 128kbps audio-only to 4Mbps HD) | P0 |
| NFR-182 | System SHALL use CDN for static assets and video delivery | P1 |
| NFR-183 | System SHALL support WebSocket connections for real-time features | P0 |
| NFR-184 | System SHALL implement connection retry with exponential backoff | P0 |
| NFR-185 | Mobile app SHALL detect network status and switch between online/offline modes | P1 |
