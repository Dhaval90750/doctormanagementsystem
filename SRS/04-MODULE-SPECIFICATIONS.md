# 04 — Module Specifications (Detailed Flows)

> **Document Version:** 1.0.0-DRAFT  
> **Last Updated:** 2026-06-27  
> **Status:** 🟡 Draft

---

## 4.1 MOD-001: Authentication — Detailed Flows

### UC-001: User Login (Email + Password)

```
Actor: Any User
Precondition: User has a registered account

Flow:
1. User opens the app (web/mobile)
2. System shows login screen with email/phone and password fields
3. User enters email and password
4. System validates credentials against stored hash
5. IF valid:
   a. System generates JWT access token (short-lived: 15 min)
   b. System generates refresh token (long-lived: 7 days)
   c. System logs the login event (IP, device, timestamp)
   d. System redirects to role-specific dashboard
6. IF invalid:
   a. System increments failed attempt counter
   b. System shows error "Invalid credentials"
   c. IF failed attempts >= 5 → lock account for 30 minutes

Alternative Flow — Mobile Biometric:
3a. User taps "Login with Fingerprint/Face"
3b. System validates biometric via device API
3c. System retrieves stored refresh token
3d. Continue from step 5

Alternative Flow — OTP Login:
3a. User enters phone number
3b. System sends OTP via SMS
3c. User enters OTP
3d. System validates OTP
3e. Continue from step 5
```

### UC-002: First Login / Password Reset

```
Actor: New User
Precondition: Admin has created the user account

Flow:
1. User receives temporary password via email/SMS
2. User logs in with temporary password
3. System detects first login flag
4. System forces password change screen
5. User enters new password (must meet policy)
6. System validates password policy
7. System updates password, clears first-login flag
8. System redirects to profile completion screen
9. User fills in optional profile fields
10. User is taken to their dashboard
```

---

## 4.2 MOD-009: Meeting Management — Detailed Flows

### UC-010: Create and Conduct a Meeting

```
Actor: Faculty / HOD / Admin
Precondition: User has meeting creation permission

CREATE PHASE:
1. User clicks "New Meeting"
2. System shows meeting creation form:
   - Title, Description, Type (dropdown)
   - Date, Start Time, End Time
   - Recurrence (None / Daily / Weekly / Bi-Weekly / Monthly / Custom)
   - Location: Physical (select room) OR Virtual (auto-creates video room)
   - Agenda items (ordered list with descriptions)
   - Participants (search by name/role/department/batch)
   - Attachments (pre-meeting documents)
   - Reminder settings
3. User fills form and clicks "Schedule Meeting"
4. System validates:
   - No scheduling conflicts for organizer
   - Room availability (if physical)
   - Participant conflicts (warning, not blocking)
5. System creates the meeting
6. System sends invitations to all participants (in-app + email + push)
7. System creates calendar event (ICS)

DURING MEETING PHASE:
8. At meeting time, organizer opens meeting
9. IF virtual meeting:
   a. System opens built-in video conferencing room
   b. Participants join via link/notification
   c. Organizer can start recording (opt-in)
   d. Live transcription begins (if enabled)
   e. Notes panel is available for collaborative note-taking
10. IF physical meeting:
   a. Organizer/secretary takes attendance
   b. Organizer takes notes in the meeting notes panel
11. During meeting, organizer can:
   - Add agenda items on the fly
   - Create action items with assignees and due dates
   - Mark agenda items as discussed
   - Share files

POST-MEETING PHASE:
12. Meeting ends → organizer clicks "End Meeting"
13. System saves:
    - Attendance list
    - Meeting notes
    - Action items
    - Recording (if recorded) → sent to Video Library
    - Transcription → linked to meeting
14. System sends meeting minutes to all participants
15. Action item assignees receive notifications
16. System schedules follow-up reminders for action items
```

### UC-011: Action Item Lifecycle

```
States: Created → Assigned → In Progress → Done / Overdue

1. Action item created during meeting
2. Assignee receives notification
3. Assignee can:
   - Update status (In Progress, Done)
   - Add comments/updates
   - Request deadline extension
4. System sends reminders at:
   - 1 day before due date
   - On due date
   - 1 day after (if overdue)
5. Organizer can:
   - View all action items dashboard
   - Filter by meeting, assignee, status
   - Mark as verified/closed
6. Overdue items appear in next meeting's agenda automatically
```

---

## 4.3 MOD-016: Video Conferencing — Detailed Flows

### UC-020: Start a Video Conference

```
Actor: Any authorized user (Faculty for lectures, any for meetings)
Precondition: User has video conferencing permission

Flow:
1. User can start a video call from:
   a. Meeting page → "Start Video Call"
   b. Teaching session → "Go Live"
   c. Quick call → from user profile or directory
   d. Scheduled session auto-opens at start time
2. System creates a video room via WebRTC signaling server
3. System generates:
   - Unique room ID
   - Shareable join link
   - Optional password
4. Host enters the room:
   - Camera/mic permission requested (browser/app)
   - Preview of own video shown
   - Host clicks "Start" to open the room
5. Participants join:
   a. Via notification link, meeting link, or in-app button
   b. IF waiting room enabled → host admits participants
   c. Participant's video/audio connects via WebRTC peer connection
   d. TURN server used if direct P2P fails (NAT traversal)
6. During the call:
   - Grid view for small groups, speaker view for large groups
   - Screen sharing via getDisplayMedia API
   - In-call chat panel
   - Notes panel (collaborative rich text)
   - Transcription panel (live speech-to-text)
   - Hand raise / reactions
   - Participant list with mute/remove controls (host)
7. Recording:
   - Host clicks "Start Recording"
   - All participants see recording indicator
   - Server-side recording captures all streams
   - Host clicks "Stop Recording"
8. Call ends:
   - Host clicks "End for All" or participants leave individually
   - System processes recording (transcoding)
   - System saves transcription
   - System saves notes
   - All artifacts linked to the meeting/session record
```

### UC-021: Live Transcription Flow

```
Technical Flow:
1. Audio stream captured from each participant's microphone
2. Audio sent to transcription engine (WebSocket connection)
3. Transcription engine performs:
   a. Voice Activity Detection (VAD)
   b. Speech-to-Text (STT) conversion
   c. Speaker identification (diarization)
4. Transcribed text streamed back in real-time
5. UI shows running transcript with speaker labels and timestamps
6. Transcript auto-saved every 30 seconds
7. Post-meeting:
   - Full transcript available for review
   - Users can edit/correct errors
   - Searchable full-text index created
   - Optional: AI summary generated
```

---

## 4.4 MOD-017: Video Learning Platform — Detailed Flows

### UC-025: Upload a Pre-Recorded Lecture

```
Actor: Faculty
Precondition: Faculty has video upload permission

Flow:
1. Faculty navigates to "Video Library" → "Upload Video"
2. System shows upload form:
   - Video file selector (drag & drop or browse)
   - Title (required)
   - Description (rich text)
   - Subject (dropdown from master data)
   - Topic (dropdown, linked to syllabus)
   - Tags (free-text, comma separated)
   - Target Audience:
     - Program Level: UG / PG / MD / MS / DM / MCh / All
     - Specific Batch (optional)
     - Department (auto-filled, editable)
   - Category: Lecture / Tutorial / Demo / Case Study / Procedure / Seminar
   - Visibility: Draft / Published / Restricted
   - Thumbnail: Auto-generated OR custom upload
3. Faculty selects video file
4. System validates:
   - File format (MP4, MOV, AVI, MKV, WebM)
   - File size (≤ 2GB)
5. Upload begins:
   - Progress bar shown
   - Resumable upload (tus protocol or similar)
   - Background upload supported on mobile
6. After upload completes:
   a. System queues video for transcoding
   b. Transcoding generates: 360p, 480p, 720p, 1080p variants
   c. System generates HLS/DASH manifest for adaptive streaming
   d. System generates thumbnail at 10% mark
   e. System runs auto-transcription for subtitles
7. Processing status shown: Uploading → Processing → Ready
8. Once ready, video appears in the library based on visibility setting
9. System sends notification to target audience (if Published)
```

### UC-026: Student Watches a Video

```
Actor: Student (UG/PG/MD/MS)
Precondition: Video is published and student has access

Flow:
1. Student navigates to Video Library
2. Student browses/searches videos:
   - Filter by: Department, Subject, Topic, Faculty, Program Level
   - Search by: Title, Description, Tags
   - Sort by: Newest, Most Viewed, Recommended
3. Student sees video card: Thumbnail, Title, Faculty, Duration, Watch Status
4. Student clicks video → opens video player page
5. Video player loads:
   - Adaptive bitrate streaming (HLS)
   - Quality auto-selected based on bandwidth
   - Previous watch position restored ("Continue from 14:32")
6. During playback:
   - Speed control (0.5x to 2x)
   - Subtitles toggle
   - Full-screen mode
   - Picture-in-picture
   - Bookmark timestamps (click to save a timestamp with optional note)
   - In-video notes panel (timestamped notes)
   - Skip forward/backward (10 sec)
7. System tracks:
   - Watch progress (percentage)
   - Total time spent
   - Playback events (pause, seek, speed change)
   - Segments watched (for analytics)
8. When video reaches completion threshold (e.g., 90%):
   - System marks as "Watched"
   - Updates student's progress record
9. Student can:
   - Like/rate the video
   - Share video link with peers
   - Download (if permitted, with DRM)
   - View related videos
```

---

## 4.5 MOD-007: Assessment — Offline Assessment Flow

### UC-030: Record Offline Assessment Results

```
Actor: Faculty / Exam Cell / Admin
Precondition: Assessment has been conducted physically

Flow:
1. User navigates to Assessments → "Record Offline Assessment"
2. User fills assessment details:
   - Assessment Name (e.g., "Internal Assessment 1 - Anatomy")
   - Type: Written / Practical / Viva / OSCE / Clinical / Lab / Seminar
   - Date conducted
   - Venue
   - Department, Subject
   - Program Level (UG/PG/MD/MS)
   - Batch / Year
   - Max Marks
   - Passing Marks
   - Components (if multi-component):
     - e.g., Theory: Max 60, Practical: Max 20, Viva: Max 20
   - Internal Examiner / External Examiner
3. User enters marks:
   OPTION A — Manual Grid Entry:
     - System shows spreadsheet-like grid
     - Rows: Students (auto-populated from batch)
     - Columns: Component marks + Total + Grade
     - User enters marks per student
   OPTION B — CSV Upload:
     - User downloads template CSV
     - User fills marks in spreadsheet
     - User uploads CSV
     - System validates and previews
4. System validates:
   - Marks within range (0 to max)
   - All required students covered
   - Component totals match
5. User saves as Draft or submits for Approval
6. IF submitted → HOD/Exam Cell reviews and Approves
7. Once approved:
   - Results merged into student's academic record
   - Visible in unified performance dashboard
   - Part of consolidated mark sheet
8. Students receive notification of results
```

---

## 4.6 MOD-018: Multi-College — Detailed Flows

### UC-035: College Onboarding

```
Actor: Super Admin
Precondition: Super Admin has platform access

Flow:
1. Super Admin navigates to "Manage Colleges" → "Add New College"
2. Fills college details:
   - College Name, Code
   - University Affiliation
   - Accreditation Status
   - Address, Contact
   - Logo upload
   - Programs offered (MBBS, BDS, MD, MS, etc.)
   - Academic year format
3. Creates College Admin user:
   - Name, Email, Phone
   - Temporary password generated
4. System creates:
   - Isolated database schema / tenant for the college
   - Default departments based on programs
   - Default role templates
   - Default settings (cloned from platform defaults)
5. College Admin receives invitation
6. College Admin logs in → sees college-specific dashboard
7. College Admin can now:
   - Add departments
   - Add faculty
   - Add students
   - Configure settings
   - Start using all modules
```

### UC-036: Cross-College Result Tracking

```
Actor: Super Admin / University Admin
Precondition: Multiple colleges are registered

Flow:
1. Super Admin opens "Cross-College Reports"
2. Selects:
   - Report type: Results Summary
   - Program: MBBS (or specific)
   - Academic Year
   - Exam Type: University / Internal
3. System aggregates data from all colleges:
   - Total students appeared
   - Pass / Fail counts per college
   - Subject-wise performance comparison
   - Top performers (college-level and overall)
4. Report displayed as:
   - Table with college-wise breakdown
   - Charts: Bar chart (pass %), Heatmap (subject performance)
5. Super Admin can:
   - Export as PDF / Excel
   - Drill down into specific college
   - Compare with previous years
```

---

## 4.7 MOD-008: Attendance — QR Code Flow

### UC-040: QR Code Based Attendance

```
Actor: Faculty (generates QR), Student (scans QR)
Precondition: Session is scheduled, Faculty has QR attendance enabled

Flow:
1. Faculty opens session → clicks "Take Attendance" → selects "QR Code"
2. System generates:
   - Time-limited QR code (refreshes every 30 seconds)
   - QR contains: session_id + timestamp + hash (prevents screenshot sharing)
3. Faculty displays QR on projector/screen
4. Students open mobile app → "Scan Attendance"
5. Student scans QR code
6. System validates:
   - QR is not expired
   - Student is enrolled in this session's batch/subject
   - Student hasn't already marked attendance for this session
   - Geolocation check (optional): student is within campus/building radius
7. IF valid → attendance marked as "Present" with timestamp
8. IF invalid → error shown with reason
9. Faculty sees real-time attendance count updating
10. After attendance window closes:
    - Faculty reviews the list
    - Can manually add students who had issues
    - Confirms and locks attendance
```

---

## 4.8 MOD-010: Notes — Collaborative Notes Flow

### UC-045: Create and Share Session Notes

```
Actor: Faculty
Precondition: A teaching session exists

Flow:
1. Faculty opens a session → "Add Notes"
2. System opens rich text editor with:
   - Formatting toolbar (bold, italic, headings, lists, tables)
   - Image/file embed
   - Code blocks (for medical formulas/references)
   - Template selector (Lecture Notes, Case Discussion, Clinical)
3. Faculty writes/pastes notes
4. Faculty sets sharing:
   - Share with: This session's students only / Department / Specific batch / All
   - Permission: View Only / View + Comment / View + Edit
5. Faculty saves notes
6. Notes are:
   - Linked to the session
   - Linked to the syllabus topic
   - Searchable via full-text search
7. Students receive notification: "New notes available for [Subject] - [Topic]"
8. Students can:
   - View notes in-app (formatted)
   - Bookmark/pin notes
   - Add personal annotations (only visible to them)
   - Download as PDF
```

---

> [!NOTE]
> This document covers the most critical user flows. Additional flows will be documented as we finalize requirements for each module during implementation.
