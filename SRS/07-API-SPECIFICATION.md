# 07 — API Specification

> **Document Version:** 1.0.0-DRAFT  
> **Last Updated:** 2026-06-27  
> **Status:** 🟡 Draft

---

## 7.1 API Design Principles

| Principle | Implementation |
|-----------|---------------|
| **Architecture** | RESTful API with JSON payloads |
| **Versioning** | URL-based: `/api/v1/...` |
| **Authentication** | Bearer token (JWT) in `Authorization` header |
| **Pagination** | Cursor-based for lists: `?cursor=xxx&limit=20` |
| **Filtering** | Query parameters: `?status=ACTIVE&department_id=xxx` |
| **Sorting** | `?sort=created_at&order=desc` |
| **Error Format** | Standardized error response with code, message, details |
| **Rate Limiting** | Per-user, per-endpoint rate limits with `X-RateLimit-*` headers |
| **Real-Time** | WebSocket for live features (video signaling, notifications, live transcription) |
| **Documentation** | OpenAPI 3.0 / Swagger UI |

---

## 7.2 Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-06-27T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "cursor": "eyJpZCI6IjEyMyJ9",
    "has_more": true,
    "next_cursor": "eyJpZCI6IjE0MyJ9"
  },
  "meta": {
    "timestamp": "2026-06-27T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-06-27T12:00:00Z",
    "request_id": "req_abc123"
  }
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| `200` | Success (GET, PUT, PATCH) |
| `201` | Created (POST) |
| `204` | No Content (DELETE) |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `409` | Conflict (duplicate, scheduling conflict) |
| `422` | Unprocessable Entity (business logic error) |
| `429` | Too Many Requests (rate limited) |
| `500` | Internal Server Error |

---

## 7.3 API Endpoint Catalog

### 7.3.1 Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/login` | Login with email/phone + password | ❌ |
| `POST` | `/auth/login/otp/request` | Request OTP for phone login | ❌ |
| `POST` | `/auth/login/otp/verify` | Verify OTP and login | ❌ |
| `POST` | `/auth/refresh` | Refresh access token | 🔄 Refresh Token |
| `POST` | `/auth/logout` | Logout (invalidate refresh token) | ✅ |
| `POST` | `/auth/password/forgot` | Request password reset | ❌ |
| `POST` | `/auth/password/reset` | Reset password with token | ❌ |
| `PUT` | `/auth/password/change` | Change password (authenticated) | ✅ |
| `GET` | `/auth/sessions` | List active sessions | ✅ |
| `DELETE` | `/auth/sessions/{id}` | Revoke a session | ✅ |

---

### 7.3.2 Users (`/api/v1/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users` | List users (with filters) | ✅ RBAC |
| `POST` | `/users` | Create user | ✅ Admin |
| `POST` | `/users/bulk-import` | Bulk import from CSV | ✅ Admin |
| `GET` | `/users/{id}` | Get user by ID | ✅ RBAC |
| `PUT` | `/users/{id}` | Update user | ✅ Self/Admin |
| `PATCH` | `/users/{id}/status` | Activate/deactivate user | ✅ Admin |
| `GET` | `/users/me` | Get current user profile | ✅ |
| `PUT` | `/users/me` | Update own profile | ✅ |
| `POST` | `/users/me/avatar` | Upload profile photo | ✅ |
| `GET` | `/users/{id}/roles` | Get user's roles | ✅ Admin |
| `POST` | `/users/{id}/roles` | Assign role to user | ✅ Admin |
| `DELETE` | `/users/{id}/roles/{roleId}` | Remove role from user | ✅ Admin |

---

### 7.3.3 Departments (`/api/v1/departments`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/departments` | List departments | ✅ |
| `POST` | `/departments` | Create department | ✅ Admin |
| `GET` | `/departments/{id}` | Get department details | ✅ |
| `PUT` | `/departments/{id}` | Update department | ✅ Admin |
| `GET` | `/departments/{id}/dashboard` | Department dashboard data | ✅ HOD+ |
| `GET` | `/departments/{id}/faculty` | List faculty in department | ✅ |
| `GET` | `/departments/{id}/students` | List students in department | ✅ |

---

### 7.3.4 Students (`/api/v1/students`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/students` | List students (filters: batch, program, year, status) | ✅ RBAC |
| `POST` | `/students` | Enroll new student | ✅ Admin |
| `GET` | `/students/{id}` | Get student profile | ✅ RBAC |
| `PUT` | `/students/{id}` | Update student profile | ✅ Admin |
| `GET` | `/students/{id}/attendance` | Student's attendance summary | ✅ Self/Faculty/Admin |
| `GET` | `/students/{id}/results` | Student's results | ✅ Self/Faculty/Admin |
| `GET` | `/students/{id}/performance` | Student's overall performance card | ✅ Self/Faculty/Admin |

---

### 7.3.5 Teaching Sessions (`/api/v1/sessions`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/sessions` | List sessions (date range, faculty, batch) | ✅ |
| `POST` | `/sessions` | Create ad-hoc session | ✅ Faculty+ |
| `GET` | `/sessions/{id}` | Get session details | ✅ |
| `PUT` | `/sessions/{id}` | Update session | ✅ Faculty+ |
| `PATCH` | `/sessions/{id}/complete` | Mark session as completed | ✅ Faculty |
| `POST` | `/sessions/{id}/go-live` | Start virtual session (creates video room) | ✅ Faculty |
| `GET` | `/sessions/{id}/attendance` | Get attendance for session | ✅ Faculty+ |
| `POST` | `/sessions/{id}/attendance` | Mark attendance | ✅ Faculty |
| `POST` | `/sessions/{id}/attendance/qr` | Generate QR for attendance | ✅ Faculty |
| `POST` | `/sessions/{id}/attendance/scan` | Student scans QR | ✅ Student |
| `GET` | `/sessions/{id}/resources` | List session resources | ✅ |
| `POST` | `/sessions/{id}/resources` | Upload resource | ✅ Faculty |

---

### 7.3.6 Timetable (`/api/v1/timetable`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/timetable` | Get timetable (batch, faculty, or facility view) | ✅ |
| `POST` | `/timetable/entries` | Create timetable entry | ✅ Admin/HOD |
| `PUT` | `/timetable/entries/{id}` | Update entry | ✅ Admin/HOD |
| `DELETE` | `/timetable/entries/{id}` | Delete entry | ✅ Admin/HOD |
| `POST` | `/timetable/validate` | Check for conflicts | ✅ Admin/HOD |
| `POST` | `/timetable/generate-sessions` | Generate session instances from timetable | ✅ Admin |

---

### 7.3.7 Meetings (`/api/v1/meetings`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/meetings` | List meetings (filters: date, type, status) | ✅ |
| `POST` | `/meetings` | Create meeting | ✅ RBAC |
| `GET` | `/meetings/{id}` | Get meeting details | ✅ Participant |
| `PUT` | `/meetings/{id}` | Update meeting | ✅ Organizer |
| `DELETE` | `/meetings/{id}` | Cancel meeting | ✅ Organizer |
| `POST` | `/meetings/{id}/start` | Start meeting (activates video room if virtual) | ✅ Organizer |
| `PATCH` | `/meetings/{id}/rsvp` | RSVP to meeting | ✅ Participant |
| `GET` | `/meetings/{id}/minutes` | Get meeting minutes | ✅ Participant |
| `POST` | `/meetings/{id}/minutes` | Save meeting minutes | ✅ Organizer/Secretary |
| `PUT` | `/meetings/{id}/minutes` | Update meeting minutes | ✅ Organizer/Secretary |
| `POST` | `/meetings/{id}/minutes/publish` | Publish minutes | ✅ Organizer |
| `GET` | `/meetings/{id}/action-items` | List action items | ✅ Participant |
| `POST` | `/meetings/{id}/action-items` | Create action item | ✅ Organizer |
| `PUT` | `/meetings/{id}/action-items/{itemId}` | Update action item | ✅ Assignee/Organizer |

---

### 7.3.8 Notes (`/api/v1/notes`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/notes` | List notes (own + shared with me) | ✅ |
| `POST` | `/notes` | Create note | ✅ |
| `GET` | `/notes/{id}` | Get note | ✅ Owner/Shared |
| `PUT` | `/notes/{id}` | Update note | ✅ Owner/Editor |
| `DELETE` | `/notes/{id}` | Delete note | ✅ Owner |
| `POST` | `/notes/{id}/share` | Share note | ✅ Owner |
| `DELETE` | `/notes/{id}/share/{shareId}` | Revoke share | ✅ Owner |
| `GET` | `/notes/search?q=...` | Search notes | ✅ |
| `GET` | `/notes/templates` | List note templates | ✅ |

---

### 7.3.9 Video Conferencing (`/api/v1/video`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/video/rooms` | Create video room | ✅ RBAC |
| `GET` | `/video/rooms/{id}` | Get room details | ✅ |
| `POST` | `/video/rooms/{id}/join` | Join room (returns WebRTC signaling token) | ✅ |
| `POST` | `/video/rooms/{id}/leave` | Leave room | ✅ |
| `POST` | `/video/rooms/{id}/end` | End room (host only) | ✅ Host |
| `POST` | `/video/rooms/{id}/recording/start` | Start recording | ✅ Host |
| `POST` | `/video/rooms/{id}/recording/stop` | Stop recording | ✅ Host |
| `POST` | `/video/rooms/{id}/transcription/start` | Start transcription | ✅ Host |
| `POST` | `/video/rooms/{id}/transcription/stop` | Stop transcription | ✅ Host |
| `GET` | `/video/rooms/{id}/participants` | List participants | ✅ |
| `PATCH` | `/video/rooms/{id}/participants/{userId}` | Mute/remove participant | ✅ Host |

**WebSocket Endpoints:**

| Endpoint | Description |
|----------|-------------|
| `ws://api/v1/video/signal/{roomId}` | WebRTC signaling (offer/answer/ICE candidates) |
| `ws://api/v1/video/chat/{roomId}` | In-call chat |
| `ws://api/v1/video/notes/{roomId}` | Collaborative notes (CRDT sync) |
| `ws://api/v1/video/transcription/{roomId}` | Live transcription stream |

---

### 7.3.10 Video Library (`/api/v1/videos`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/videos` | List videos (filters: dept, subject, level, category) | ✅ |
| `POST` | `/videos/upload` | Upload video (multipart, resumable) | ✅ Faculty |
| `GET` | `/videos/{id}` | Get video details | ✅ |
| `PUT` | `/videos/{id}` | Update video metadata | ✅ Uploader |
| `DELETE` | `/videos/{id}` | Delete video | ✅ Uploader/Admin |
| `PATCH` | `/videos/{id}/visibility` | Change visibility | ✅ Uploader |
| `GET` | `/videos/{id}/stream` | Get streaming URL (signed, time-limited) | ✅ |
| `GET` | `/videos/{id}/progress` | Get watch progress (current user) | ✅ |
| `PUT` | `/videos/{id}/progress` | Update watch progress | ✅ |
| `POST` | `/videos/{id}/bookmark` | Add bookmark | ✅ |
| `GET` | `/videos/{id}/analytics` | Video analytics (views, completion rate) | ✅ Uploader/Admin |
| `GET` | `/videos/{id}/transcription` | Get video transcription | ✅ |
| `GET` | `/videos/continue-watching` | Get "Continue Watching" list | ✅ |
| `GET` | `/videos/search?q=...` | Search videos | ✅ |

---

### 7.3.11 Assessments (`/api/v1/assessments`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/assessments/offline` | List offline assessments | ✅ RBAC |
| `POST` | `/assessments/offline` | Create offline assessment | ✅ Faculty/Admin |
| `GET` | `/assessments/offline/{id}` | Get assessment details | ✅ RBAC |
| `PUT` | `/assessments/offline/{id}` | Update assessment | ✅ Creator |
| `POST` | `/assessments/offline/{id}/results` | Enter marks (single student) | ✅ Faculty |
| `POST` | `/assessments/offline/{id}/results/bulk` | Bulk enter marks (CSV/grid) | ✅ Faculty |
| `GET` | `/assessments/offline/{id}/results` | Get all results | ✅ RBAC |
| `PATCH` | `/assessments/offline/{id}/submit` | Submit for approval | ✅ Faculty |
| `PATCH` | `/assessments/offline/{id}/approve` | Approve results | ✅ HOD/ExamCell |
| `PATCH` | `/assessments/offline/{id}/publish` | Publish results | ✅ Admin |

---

### 7.3.12 Colleges (`/api/v1/colleges`) — Super Admin Only

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/colleges` | List all colleges | ✅ SuperAdmin |
| `POST` | `/colleges` | Register new college | ✅ SuperAdmin |
| `GET` | `/colleges/{id}` | Get college details | ✅ SuperAdmin/CollegeAdmin |
| `PUT` | `/colleges/{id}` | Update college | ✅ SuperAdmin |
| `PATCH` | `/colleges/{id}/status` | Activate/suspend college | ✅ SuperAdmin |
| `GET` | `/colleges/{id}/dashboard` | College dashboard | ✅ CollegeAdmin |
| `GET` | `/colleges/analytics` | Cross-college analytics | ✅ SuperAdmin |

---

### 7.3.13 Reports (`/api/v1/reports`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/reports/attendance` | Attendance report | ✅ RBAC |
| `GET` | `/reports/faculty-workload` | Faculty workload report | ✅ Admin/HOD |
| `GET` | `/reports/syllabus-coverage` | Syllabus coverage report | ✅ Admin/HOD |
| `GET` | `/reports/results-summary` | Results summary report | ✅ RBAC |
| `GET` | `/reports/student-performance/{studentId}` | Individual student performance | ✅ RBAC |
| `GET` | `/reports/facility-utilization` | Facility utilization report | ✅ Admin |
| `GET` | `/reports/video-engagement` | Video engagement report | ✅ Admin/HOD |
| `POST` | `/reports/export` | Export report as PDF/Excel | ✅ RBAC |

---

### 7.3.14 Notifications (`/api/v1/notifications`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/notifications` | List notifications (paginated) | ✅ |
| `PATCH` | `/notifications/{id}/read` | Mark as read | ✅ |
| `PATCH` | `/notifications/read-all` | Mark all as read | ✅ |
| `GET` | `/notifications/unread-count` | Get unread count | ✅ |
| `GET` | `/notifications/preferences` | Get notification preferences | ✅ |
| `PUT` | `/notifications/preferences` | Update preferences | ✅ |

**WebSocket:**

| Endpoint | Description |
|----------|-------------|
| `ws://api/v1/notifications/stream` | Real-time notification stream |

---

## 7.4 Authentication Flow

```
┌────────┐          ┌────────────┐          ┌──────────┐
│ Client │          │  API Server │          │ Database │
└───┬────┘          └─────┬──────┘          └────┬─────┘
    │                     │                      │
    │  POST /auth/login   │                      │
    │  {email, password}  │                      │
    │────────────────────>│                      │
    │                     │  Verify credentials  │
    │                     │─────────────────────>│
    │                     │  User data           │
    │                     │<─────────────────────│
    │                     │                      │
    │                     │  Generate JWT        │
    │                     │  (access + refresh)  │
    │                     │                      │
    │  {access_token,     │                      │
    │   refresh_token,    │                      │
    │   user, roles}      │                      │
    │<────────────────────│                      │
    │                     │                      │
    │  GET /api/v1/...    │                      │
    │  Authorization:     │                      │
    │  Bearer <token>     │                      │
    │────────────────────>│                      │
    │                     │  Validate JWT        │
    │                     │  Check permissions   │
    │                     │─────────────────────>│
    │                     │                      │
    │  Response data      │                      │
    │<────────────────────│                      │
```

---

## 7.5 WebSocket Events (Real-Time)

### Notification Events
```json
// Server → Client
{ "type": "NOTIFICATION", "data": { "id": "...", "title": "...", "body": "...", "category": "MEETING", "action_url": "/meetings/123" } }
```

### Video Signaling Events
```json
// Client → Server
{ "type": "OFFER", "data": { "sdp": "...", "target_user_id": "..." } }
{ "type": "ANSWER", "data": { "sdp": "...", "target_user_id": "..." } }
{ "type": "ICE_CANDIDATE", "data": { "candidate": "...", "target_user_id": "..." } }

// Server → Client
{ "type": "PARTICIPANT_JOINED", "data": { "user_id": "...", "name": "...", "role": "..." } }
{ "type": "PARTICIPANT_LEFT", "data": { "user_id": "..." } }
{ "type": "RECORDING_STARTED", "data": { "started_by": "..." } }
{ "type": "HAND_RAISED", "data": { "user_id": "...", "name": "..." } }
```

### Live Transcription Events
```json
// Server → Client
{ "type": "TRANSCRIPT_SEGMENT", "data": { "speaker": "Dr. Smith", "text": "The aorta branches into...", "timestamp": 1234567890, "is_final": true } }
```

### Collaborative Notes Events
```json
// Bidirectional — CRDT operations
{ "type": "NOTE_OPERATION", "data": { "operation": "insert", "position": 42, "text": "Important: ", "user_id": "..." } }
```
