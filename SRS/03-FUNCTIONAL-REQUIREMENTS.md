# 03 — Functional Requirements

> **Document Version:** 1.0.0-DRAFT  
> **Last Updated:** 2026-06-27  
> **Status:** 🟡 Draft

---

## 3.1 Module Overview

The system is organized into the following functional modules:

```
DSMS
├── MOD-001: Authentication & Authorization
├── MOD-002: User Management
├── MOD-003: Department & Institution Management (Multi-College)
├── MOD-004: Student Management (UG / PG / MD / MS / Intern)
├── MOD-005: Faculty / Doctor Management
├── MOD-006: Teaching & Academic Management
│     ├── Curriculum & Syllabus
│     ├── Timetable & Scheduling
│     ├── Lectures & Sessions
│     └── Clinical Rotations & Postings
├── MOD-007: Assessment & Evaluation
│     ├── Assignments
│     ├── Examinations (Online + Offline)
│     ├── Clinical Evaluations (OSCE, Viva, etc.)
│     ├── Offline Assessment Tracking
│     └── Grading & Results
├── MOD-008: Attendance Management
├── MOD-009: Meeting Management
├── MOD-010: Notes & Document Management
├── MOD-011: Place / Facility Management
├── MOD-012: Communication & Notifications
├── MOD-013: Reports & Analytics
├── MOD-014: System Configuration & Administration
├── MOD-015: Audit & Logging
├── MOD-016: Video Conferencing (Built-in WebRTC)
│     ├── Live Video Calls & Rooms
│     ├── Screen Sharing
│     ├── In-Call Notes & Whiteboard
│     ├── Live Transcription
│     └── Session Recording
├── MOD-017: Video Learning Platform
│     ├── Video Upload & Transcoding
│     ├── Video Library & Organization
│     ├── Video Streaming & Playback
│     ├── Pre-Recorded Lecture Management
│     └── Watch Progress Tracking
└── MOD-018: Multi-College / Institution Management
      ├── College Registration & Onboarding
      ├── Cross-College Student Tracking
      ├── Centralized Reporting
      └── College-Level Admin Portal
```

---

## 3.2 MOD-001: Authentication & Authorization

### FR-001: User Authentication

| ID | Requirement | Priority |
|----|------------|----------|
| FR-001.1 | System SHALL support email + password based authentication | P0 |
| FR-001.2 | System SHALL support mobile number + OTP based authentication | P0 |
| FR-001.3 | System SHALL enforce password policy (min 8 chars, 1 uppercase, 1 number, 1 special) | P0 |
| FR-001.4 | System SHALL support "Forgot Password" via email/SMS OTP | P0 |
| FR-001.5 | System SHALL lock account after 5 consecutive failed login attempts for 30 minutes | P1 |
| FR-001.6 | System SHALL support JWT-based session management with refresh tokens | P0 |
| FR-001.7 | System SHALL support "Remember Me" functionality (configurable expiry) | P2 |
| FR-001.8 | System SHOULD support SSO via Google/Microsoft (OAuth 2.0) in future | P3 |
| FR-001.9 | System SHALL support biometric login (fingerprint/face) on mobile | P1 |
| FR-001.10 | System SHALL maintain active session list — user can revoke sessions from other devices | P1 |

### FR-002: Authorization

| ID | Requirement | Priority |
|----|------------|----------|
| FR-002.1 | System SHALL enforce RBAC as defined in 02-USER-ROLES-AND-ACCESS-CONTROL | P0 |
| FR-002.2 | System SHALL check permissions on every API call (server-side) | P0 |
| FR-002.3 | System SHALL dynamically show/hide UI elements based on user permissions | P0 |
| FR-002.4 | System SHALL support multi-role assignment per user | P1 |
| FR-002.5 | System SHALL support temporal permissions (valid_from, valid_until) | P2 |

---

## 3.3 MOD-002: User Management

### FR-003: User CRUD

| ID | Requirement | Priority |
|----|------------|----------|
| FR-003.1 | Admin SHALL be able to create new user accounts (manual entry) | P0 |
| FR-003.2 | Admin SHALL be able to bulk import users via CSV/Excel upload | P1 |
| FR-003.3 | System SHALL generate a temporary password and send via email/SMS on user creation | P0 |
| FR-003.4 | System SHALL force password change on first login | P0 |
| FR-003.5 | Admin SHALL be able to activate/deactivate user accounts | P0 |
| FR-003.6 | Admin SHALL be able to edit user profiles (except system-generated fields) | P0 |
| FR-003.7 | Users SHALL be able to edit their own profile (name, photo, contact, bio) | P0 |
| FR-003.8 | System SHALL maintain a complete user directory with search & filter | P0 |
| FR-003.9 | System SHALL support profile photos (upload + crop) | P1 |
| FR-003.10 | System SHALL store user's department, designation, specialization, and qualifications | P0 |

### FR-004: User Profile Fields

| Field | Type | Required | Editable By |
|-------|------|----------|-------------|
| Full Name | Text | ✅ | Self, Admin |
| Email | Email | ✅ | Admin only |
| Phone | Phone | ✅ | Self, Admin |
| Date of Birth | Date | ✅ | Admin only |
| Gender | Enum | ✅ | Admin only |
| Profile Photo | Image | ❌ | Self |
| Employee/Student ID | Text | ✅ | Admin only (auto-generated option) |
| Department | Reference | ✅ | Admin, HOD |
| Designation | Text | ✅ | Admin, HOD |
| Specialization | Text | ❌ | Self, Admin |
| Qualifications | Text | ❌ | Self, Admin |
| Joining Date | Date | ✅ | Admin only |
| Address | Text | ❌ | Self, Admin |
| Emergency Contact | Text | ❌ | Self, Admin |
| Blood Group | Enum | ❌ | Self, Admin |
| Status | Enum (Active/Inactive/On Leave) | ✅ | Admin only |
| Bio / About | Text | ❌ | Self |

---

## 3.4 MOD-003: Department & Institution Management

### FR-005: Institution / College Setup

| ID | Requirement | Priority |
|----|------------|----------|
| FR-005.1 | Super Admin SHALL register multiple colleges/institutions on the platform | P0 |
| FR-005.2 | Each college SHALL have: name, code, logo, address, contact, accreditation info, university affiliation | P0 |
| FR-005.3 | System SHALL support institution-level settings (academic year format, working hours, etc.) | P0 |
| FR-005.4 | System SHALL support academic calendar configuration per college (semesters, holidays, exam periods) | P1 |
| FR-005.5 | System SHALL provide a college-level admin portal for each institution | P0 |
| FR-005.6 | System SHALL isolate data between colleges while allowing cross-college views for Super Admin | P0 |
| FR-005.7 | System SHALL support programs offered per college (e.g., College A offers MBBS+MD, College B offers BDS+MDS) | P0 |

### FR-006: Department Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-006.1 | Admin SHALL be able to create, edit, deactivate departments within a college | P0 |
| FR-006.2 | Each department SHALL have: name, code, HOD, description, contact info, college association | P0 |
| FR-006.3 | Departments SHALL support sub-units/divisions (e.g., Surgery → General Surgery, Ortho, etc.) | P1 |
| FR-006.4 | System SHALL show department dashboard with faculty count, student count, active sessions | P1 |
| FR-006.5 | Admin SHALL be able to assign/change HOD for a department | P0 |
| FR-006.6 | System SHALL support cross-department student postings (student from Dept A posted to Dept B) | P1 |

---

## 3.5 MOD-004: Student Management

### FR-007: Student Enrollment & Profiles

| ID | Requirement | Priority |
|----|------------|----------|
| FR-007.1 | Admin SHALL enroll students with academic details (batch, year, enrollment number) | P0 |
| FR-007.2 | System SHALL support batch/cohort management (e.g., "Batch 2024", "MBBS 2022-2027") | P0 |
| FR-007.3 | System SHALL maintain student academic history (year progression, subjects, results) | P0 |
| FR-007.4 | System SHALL track student's current status (Active, On Leave, Suspended, Graduated, Dropped) | P0 |
| FR-007.5 | System SHALL support student transfer between departments (for clinical postings) | P1 |
| FR-007.6 | Student profile SHALL include all FR-004 fields PLUS academic-specific fields | P0 |

### FR-008: Student Academic Fields (Additional)

| Field | Type | Required |
|-------|------|----------|
| Enrollment Number | Text | ✅ |
| College / Institution | Reference | ✅ |
| Batch / Cohort | Reference | ✅ |
| Program | Enum (MBBS/BDS/MD/MS/DM/MCh/DNB/Diploma/Fellowship) | ✅ |
| Program Level | Enum (UG/PG/Super-Specialty/Diploma/Fellowship) | ✅ |
| Current Year / Semester | Number | ✅ |
| Admission Date | Date | ✅ |
| Category (General/SC/ST/OBC/etc.) | Enum | ❌ |
| Admission Type (Merit/Management/NRI) | Enum | ❌ |
| Previous Institution | Text | ❌ |
| Guardian Name | Text | ✅ |
| Guardian Contact | Phone | ✅ |
| Guardian Relation | Enum | ✅ |

---

## 3.6 MOD-005: Faculty / Doctor Management

### FR-009: Faculty Profiles & Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-009.1 | Admin/HOD SHALL manage faculty profiles with professional details | P0 |
| FR-009.2 | Faculty profile SHALL include: qualifications, specializations, experience, registration number | P0 |
| FR-009.3 | System SHALL track faculty's teaching load (hours per week/month) | P1 |
| FR-009.4 | System SHALL support faculty availability management (available slots, leave, OOO) | P1 |
| FR-009.5 | System SHALL track faculty's associated subjects and competencies | P1 |
| FR-009.6 | System SHALL support visiting/guest faculty with temporary profiles | P2 |

---

## 3.7 MOD-006: Teaching & Academic Management

### FR-010: Curriculum & Syllabus

| ID | Requirement | Priority |
|----|------------|----------|
| FR-010.1 | HOD/Admin SHALL define syllabus per program per year/semester | P0 |
| FR-010.2 | Syllabus SHALL be organized into: Subject → Topics → Sub-Topics | P0 |
| FR-010.3 | Each topic SHALL have: title, description, learning objectives, teaching hours allocated | P0 |
| FR-010.4 | System SHALL track syllabus completion percentage per subject | P1 |
| FR-010.5 | System SHALL allow attaching reference materials to topics (PDFs, links, videos) | P1 |
| FR-010.6 | System SHALL support versioned syllabus (different versions for different batches) | P2 |

### FR-011: Timetable & Scheduling

| ID | Requirement | Priority |
|----|------------|----------|
| FR-011.1 | Admin/HOD SHALL create timetables for each batch/year | P0 |
| FR-011.2 | Timetable entry SHALL include: subject, faculty, room, time slot, type (lecture/practical/clinical) | P0 |
| FR-011.3 | System SHALL detect scheduling conflicts (faculty double-booked, room double-booked) | P0 |
| FR-011.4 | System SHALL support recurring schedules (weekly pattern with exception dates) | P0 |
| FR-011.5 | System SHALL support ad-hoc/extra sessions | P1 |
| FR-011.6 | Timetable changes SHALL trigger notifications to affected students and faculty | P0 |
| FR-011.7 | System SHALL support timetable view modes: daily, weekly, monthly | P0 |
| FR-011.8 | System SHALL support drag-and-drop timetable editing on web | P2 |
| FR-011.9 | Faculty SHALL be able to request time slot swaps (with HOD approval) | P2 |

### FR-012: Lectures & Teaching Sessions

| ID | Requirement | Priority |
|----|------------|----------|
| FR-012.1 | System SHALL support multiple session types: Lecture, Tutorial, Practical, Seminar, Case Discussion, Grand Round, Journal Club, Clinical Posting | P0 |
| FR-012.2 | Each session SHALL record: topic covered, faculty, attendance, duration, notes/resources shared | P0 |
| FR-012.3 | Faculty SHALL be able to mark a session as completed and log topics covered | P0 |
| FR-012.4 | System SHALL link sessions to syllabus topics for coverage tracking | P1 |
| FR-012.5 | Faculty SHALL be able to share resources (files, links) per session | P1 |
| FR-012.6 | Students SHALL be able to provide session feedback (optional, anonymous) | P2 |

### FR-013: Clinical Rotations & Postings

| ID | Requirement | Priority |
|----|------------|----------|
| FR-013.1 | HOD/Admin SHALL create rotation schedules for PG students and interns | P0 |
| FR-013.2 | Rotation schedule SHALL define: department, unit, start date, end date, supervising faculty | P0 |
| FR-013.3 | System SHALL support standard rotation templates (e.g., "PG Year 1 General Surgery — 6 months") | P1 |
| FR-013.4 | Students on rotation SHALL log daily activities (cases seen, procedures assisted/performed) | P0 |
| FR-013.5 | Supervising faculty SHALL review and sign off on activity logs | P0 |
| FR-013.6 | System SHALL generate rotation completion certificates | P2 |
| FR-013.7 | System SHALL track minimum required procedures/cases per rotation (competency tracking) | P1 |

---

## 3.8 MOD-007: Assessment & Evaluation

### FR-014: Assignments

| ID | Requirement | Priority |
|----|------------|----------|
| FR-014.1 | Faculty SHALL create assignments with: title, description, due date, max marks, attachments | P0 |
| FR-014.2 | Students SHALL submit assignments (file upload + optional text) | P0 |
| FR-014.3 | System SHALL enforce submission deadlines (configurable: hard/soft deadline, late submission penalty) | P0 |
| FR-014.4 | Faculty SHALL grade assignments with marks and feedback comments | P0 |
| FR-014.5 | System SHALL support assignment rubrics (predefined grading criteria) | P2 |
| FR-014.6 | System SHALL send reminders before assignment deadlines | P1 |

### FR-015: Examinations

| ID | Requirement | Priority |
|----|------------|----------|
| FR-015.1 | Exam Cell SHALL create exams with: name, type (Internal/External/Practical/Viva), date, time, venue, subjects | P0 |
| FR-015.2 | System SHALL support exam types: MCQ, Descriptive, Practical, OSCE, Viva Voce, Clinical | P0 |
| FR-015.3 | System SHALL generate and publish exam schedules | P0 |
| FR-015.4 | System SHALL support hall ticket generation (PDF with photo, roll number, exam details) | P2 |
| FR-015.5 | System SHALL support seating arrangement generation | P3 |
| FR-015.6 | Faculty/Exam Cell SHALL enter marks/grades per student per subject | P0 |
| FR-015.7 | System SHALL compute results based on configurable grading rules (absolute, relative, grace marks) | P1 |
| FR-015.8 | System SHALL publish results with controlled visibility (draft → approved → published) | P0 |
| FR-015.9 | System SHALL support revaluation requests from students | P2 |
| FR-015.10 | System SHALL generate result sheets, mark sheets (individual and consolidated) | P1 |

### FR-016: Clinical Evaluations

| ID | Requirement | Priority |
|----|------------|----------|
| FR-016.1 | System SHALL support structured clinical evaluation forms (Mini-CEX, DOPS, CBD) | P1 |
| FR-016.2 | Faculty SHALL evaluate students on clinical skills using rating scales | P1 |
| FR-016.3 | System SHALL track competency-based progression (EPA — Entrustable Professional Activities) | P2 |
| FR-016.4 | System SHALL support 360-degree feedback (self, peer, supervisor, patient) | P3 |
| FR-016.5 | System SHALL generate competency heatmaps showing student progress | P2 |

### FR-016B: Offline Assessment Tracking

| ID | Requirement | Priority |
|----|------------|----------|
| FR-016B.1 | System SHALL allow faculty/admin to record results of offline/physical assessments | P0 |
| FR-016B.2 | Offline assessment entry SHALL include: assessment name, type, date, venue, max marks, obtained marks per student | P0 |
| FR-016B.3 | System SHALL support offline assessment types: Written Exam, Practical Exam, Viva Voce, Clinical Exam, OSCE, Lab Assessment, Seminar Presentation | P0 |
| FR-016B.4 | System SHALL support bulk marks entry (spreadsheet-style grid or CSV upload) | P1 |
| FR-016B.5 | System SHALL merge offline assessment results with online results for unified student performance view | P0 |
| FR-016B.6 | System SHALL support internal and external examiner marks entry separately | P1 |
| FR-016B.7 | System SHALL support multi-component assessments (e.g., Theory 60% + Practical 20% + Viva 20%) | P0 |
| FR-016B.8 | System SHALL generate consolidated mark sheets combining all assessment types | P1 |
| FR-016B.9 | Colleges SHALL be able to track and compare offline assessment results across departments | P1 |

---

## 3.9 MOD-008: Attendance Management

### FR-017: Attendance Tracking

| ID | Requirement | Priority |
|----|------------|----------|
| FR-017.1 | Faculty SHALL mark attendance for their sessions (present, absent, late, excused) | P0 |
| FR-017.2 | System SHALL support QR code-based self-attendance (student scans QR shown in class) | P1 |
| FR-017.3 | System SHALL support manual attendance entry by faculty/admin | P0 |
| FR-017.4 | System SHALL calculate attendance percentage per student per subject | P0 |
| FR-017.5 | System SHALL alert when student's attendance falls below threshold (configurable: e.g., 75%) | P0 |
| FR-017.6 | System SHALL generate attendance reports (daily, weekly, monthly, subject-wise) | P0 |
| FR-017.7 | System SHALL support attendance correction requests (student requests, faculty approves) | P1 |
| FR-017.8 | System SHALL track attendance for: lectures, practicals, clinical postings, duties separately | P0 |
| FR-017.9 | HOD SHALL view department-wide attendance analytics | P1 |
| FR-017.10 | System SHALL support geolocation-based attendance verification (optional, for clinical postings) | P3 |

---

## 3.10 MOD-009: Meeting Management

### FR-018: Meeting Scheduling

| ID | Requirement | Priority |
|----|------------|----------|
| FR-018.1 | Authorized users SHALL create meetings with: title, agenda, date/time, duration, location, participants | P0 |
| FR-018.2 | System SHALL support meeting types: Departmental, Faculty, Academic Council, Clinical, Journal Club, Case Review, Administrative, Committee, One-on-One | P0 |
| FR-018.3 | System SHALL support recurring meetings (daily, weekly, bi-weekly, monthly, custom) | P0 |
| FR-018.4 | System SHALL send meeting invitations with calendar integration (ICS file) | P1 |
| FR-018.5 | Participants SHALL RSVP (Accept, Tentative, Decline) | P1 |
| FR-018.6 | System SHALL check participant availability and warn about conflicts | P1 |
| FR-018.7 | System SHALL support meeting room booking (linked to Place Management) | P1 |
| FR-018.8 | System SHALL send meeting reminders (configurable: 15min, 30min, 1hr, 1day before) | P0 |

### FR-019: Meeting Minutes & Action Items

| ID | Requirement | Priority |
|----|------------|----------|
| FR-019.1 | Meeting organizer/secretary SHALL record meeting minutes during/after the meeting | P0 |
| FR-019.2 | Minutes SHALL support: attendees list, discussion points, decisions made, action items | P0 |
| FR-019.3 | Action items SHALL have: description, assignee, due date, status (Open/In Progress/Done/Overdue) | P0 |
| FR-019.4 | System SHALL notify assignees of new action items | P0 |
| FR-019.5 | System SHALL send reminders for approaching/overdue action items | P1 |
| FR-019.6 | System SHALL track action item completion across meetings | P1 |
| FR-019.7 | Minutes SHALL be shareable with participants and optionally with others | P0 |
| FR-019.8 | System SHALL maintain a meeting history with searchable minutes | P1 |
| FR-019.9 | System SHALL support attaching files/documents to meetings | P1 |
| FR-019.10 | System SHALL support meeting templates for recurring meeting types | P2 |

---

## 3.11 MOD-010: Notes & Document Management

### FR-020: Notes System

| ID | Requirement | Priority |
|----|------------|----------|
| FR-020.1 | All users SHALL be able to create personal notes (rich text) | P0 |
| FR-020.2 | Notes SHALL support: title, content (rich text), tags, category, attachments | P0 |
| FR-020.3 | Notes SHALL be organizable into folders/notebooks | P1 |
| FR-020.4 | Users SHALL be able to share notes with: specific users, roles, departments, batches, or make public | P0 |
| FR-020.5 | Shared notes SHALL support permission levels: View Only, Comment, Edit | P1 |
| FR-020.6 | System SHALL support note templates (e.g., "Case Discussion Template", "Lecture Summary Template") | P1 |
| FR-020.7 | Notes SHALL be searchable (full-text search across title, content, tags) | P0 |
| FR-020.8 | System SHALL support pinning/bookmarking important notes | P1 |
| FR-020.9 | System SHALL support note versioning (track changes, restore previous versions) | P2 |
| FR-020.10 | Faculty SHALL be able to create session-linked notes (auto-linked to a teaching session) | P1 |

### FR-021: Document Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-021.1 | System SHALL support file uploads (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, images, videos) | P0 |
| FR-021.2 | System SHALL enforce file size limits (configurable, default 50MB per file) | P0 |
| FR-021.3 | System SHALL organize documents into a folder structure per department | P0 |
| FR-021.4 | System SHALL support document categorization (Syllabus, Study Material, Question Paper, Circular, Notice, Template, Other) | P1 |
| FR-021.5 | System SHALL support document versioning (upload new version, keep history) | P2 |
| FR-021.6 | System SHALL support document sharing with same scope as notes (users, roles, departments) | P0 |
| FR-021.7 | System SHALL support document preview (in-app PDF/image viewer) | P1 |
| FR-021.8 | System SHALL support document download tracking (who downloaded what, when) | P2 |

---

## 3.12 MOD-011: Place / Facility Management

### FR-022: Facility Registry

| ID | Requirement | Priority |
|----|------------|----------|
| FR-022.1 | Admin SHALL register facilities with: name, type, capacity, location, amenities, status | P0 |
| FR-022.2 | System SHALL support facility types: Lecture Hall, Seminar Room, Lab, Library, OPD, Ward, OT, ICU, Conference Room, Auditorium, Skill Lab, Simulation Center | P0 |
| FR-022.3 | Each facility SHALL have a unique code and floor/building information | P0 |
| FR-022.4 | Admin SHALL be able to mark facilities as: Available, Under Maintenance, Reserved, Decommissioned | P0 |

### FR-023: Facility Booking

| ID | Requirement | Priority |
|----|------------|----------|
| FR-023.1 | Authorized users SHALL request facility booking for a time slot | P0 |
| FR-023.2 | System SHALL check for booking conflicts and prevent double-booking | P0 |
| FR-023.3 | Bookings SHALL support: one-time, recurring, block booking (e.g., whole week) | P1 |
| FR-023.4 | System SHALL support approval workflow for bookings (auto-approve for some roles, approval needed for others) | P1 |
| FR-023.5 | System SHALL show facility availability calendar (visual) | P1 |
| FR-023.6 | System SHALL send booking confirmation and reminders | P0 |
| FR-023.7 | Users SHALL be able to cancel/modify their bookings (within policy) | P0 |

---

## 3.13 MOD-012: Communication & Notifications

### FR-024: Announcements

| ID | Requirement | Priority |
|----|------------|----------|
| FR-024.1 | Authorized users SHALL create announcements targeting: all, department, batch, role, specific users | P0 |
| FR-024.2 | Announcements SHALL support: title, content (rich text), attachments, priority (Normal/Important/Urgent) | P0 |
| FR-024.3 | Announcements SHALL support scheduling (publish at a future date) | P2 |
| FR-024.4 | Announcements SHALL support expiry date (auto-archive) | P2 |
| FR-024.5 | System SHALL track read receipts for important announcements | P1 |

### FR-025: Notifications

| ID | Requirement | Priority |
|----|------------|----------|
| FR-025.1 | System SHALL send push notifications (mobile) for all important events | P0 |
| FR-025.2 | System SHALL show in-app notification center with all notifications | P0 |
| FR-025.3 | System SHALL send email notifications for critical events (configurable) | P1 |
| FR-025.4 | Users SHALL be able to configure notification preferences (what to receive, channels) | P1 |
| FR-025.5 | System SHALL support notification categories: Academic, Meeting, Assignment, Attendance, Announcement, System | P0 |
| FR-025.6 | System SHALL batch non-urgent notifications into digest (configurable: real-time, hourly, daily) | P2 |

### FR-026: Messaging (Phase 2 — Optional in Phase 1)

| ID | Requirement | Priority |
|----|------------|----------|
| FR-026.1 | System SHOULD support direct messaging between users | P2 |
| FR-026.2 | System SHOULD support group chats (department, batch, custom groups) | P3 |
| FR-026.3 | Messages SHOULD support text, file attachments, and links | P2 |

---

## 3.14 MOD-013: Reports & Analytics

### FR-027: Predefined Reports

| ID | Report | Accessible By |
|----|--------|--------------|
| FR-027.1 | Student Attendance Report (per student, per subject, per batch) | Admin, HOD, Faculty, Student (own) |
| FR-027.2 | Faculty Workload Report (teaching hours, sessions conducted) | Admin, HOD |
| FR-027.3 | Syllabus Coverage Report (per subject, per department) | Admin, HOD, Faculty |
| FR-027.4 | Examination Results Summary (pass %, distinction %, subject-wise analysis) | Admin, HOD, Exam Cell |
| FR-027.5 | Student Performance Report (individual academic card) | Admin, HOD, Faculty, Student (own) |
| FR-027.6 | Meeting Summary Report (meetings held, action items status) | Admin, HOD |
| FR-027.7 | Facility Utilization Report (booking %, peak usage times) | Admin |
| FR-027.8 | Clinical Rotation Log Summary (per student, per department) | Admin, HOD, Faculty |
| FR-027.9 | Department Dashboard (students, faculty, sessions, attendance trends) | Admin, HOD |
| FR-027.10 | Duty Roster Report | Admin, HOD |

### FR-028: Report Features

| ID | Requirement | Priority |
|----|------------|----------|
| FR-028.1 | All reports SHALL support date range filtering | P0 |
| FR-028.2 | All reports SHALL support export to PDF and Excel | P0 |
| FR-028.3 | System SHALL provide visual dashboards with charts (bar, line, pie, heatmaps) | P1 |
| FR-028.4 | System SHALL support custom report builder (select fields, filters, grouping) | P3 |
| FR-028.5 | System SHALL support scheduled report generation (auto-email weekly/monthly) | P3 |

---

## 3.15 MOD-014: System Configuration

### FR-029: System Settings

| ID | Requirement | Priority |
|----|------------|----------|
| FR-029.1 | Admin SHALL configure: institution profile, logo, theme colors | P0 |
| FR-029.2 | Admin SHALL configure: academic year, semesters, working days, holidays | P0 |
| FR-029.3 | Admin SHALL configure: attendance threshold percentages | P0 |
| FR-029.4 | Admin SHALL configure: grading scales and rules | P1 |
| FR-029.5 | Admin SHALL configure: notification preferences (global defaults) | P1 |
| FR-029.6 | Admin SHALL configure: file upload limits and allowed file types | P1 |
| FR-029.7 | Admin SHALL configure: password policies and session timeouts | P0 |
| FR-029.8 | Admin SHALL manage: master data (designations, specializations, programs, subjects) | P0 |
| FR-029.9 | Admin SHALL configure: approval workflows (what needs approval, who approves) | P2 |

---

## 3.16 MOD-015: Audit & Logging

### FR-030: Audit Trail

| ID | Requirement | Priority |
|----|------------|----------|
| FR-030.1 | System SHALL log all create, update, delete operations with user, timestamp, IP, old/new values | P0 |
| FR-030.2 | System SHALL log all login/logout events | P0 |
| FR-030.3 | System SHALL log all permission changes | P0 |
| FR-030.4 | System SHALL log all data exports | P1 |
| FR-030.5 | Audit logs SHALL be searchable and filterable (by user, action, module, date range) | P0 |
| FR-030.6 | Audit logs SHALL be immutable (cannot be modified or deleted) | P0 |
| FR-030.7 | System SHALL support audit log export for compliance | P2 |

---

## 3.17 MOD-016: Video Conferencing (Built-in)

### FR-031: Live Video Conferencing

| ID | Requirement | Priority |
|----|------------|----------|
| FR-031.1 | System SHALL provide built-in video conferencing using WebRTC (NO third-party dependency like Zoom/Meet) | P0 |
| FR-031.2 | System SHALL support 1-on-1 video calls between any two users | P0 |
| FR-031.3 | System SHALL support group video calls (up to 50 participants for lectures, 200+ for webinars) | P0 |
| FR-031.4 | System SHALL support audio-only mode for low-bandwidth participants | P0 |
| FR-031.5 | System SHALL support screen sharing (full screen, application window, browser tab) | P0 |
| FR-031.6 | System SHALL support a virtual whiteboard for drawing/annotation during calls | P1 |
| FR-031.7 | System SHALL support presentation mode (speaker highlights, slide sharing) | P1 |
| FR-031.8 | System SHALL support chat within a video call (text messages, file sharing) | P0 |
| FR-031.9 | System SHALL support hand raise, reactions (thumbs up, clap, etc.) | P1 |
| FR-031.10 | System SHALL support participant management (mute/unmute, remove, promote to presenter) | P0 |
| FR-031.11 | System SHALL support breakout rooms (split participants into smaller groups) | P2 |
| FR-031.12 | System SHALL support waiting room / lobby (host admits participants) | P1 |
| FR-031.13 | System SHALL support bandwidth adaptation (auto-adjust video quality based on network) | P0 |
| FR-031.14 | System SHALL work on both web (browser) and mobile app seamlessly | P0 |
| FR-031.15 | System SHALL support joining via a shareable link (with optional password) | P0 |

### FR-032: In-Call Notes & Transcription

| ID | Requirement | Priority |
|----|------------|----------|
| FR-032.1 | System SHALL provide a live notes panel during video calls (rich text editor) | P0 |
| FR-032.2 | Multiple participants SHALL be able to collaboratively edit notes in real-time during the call | P1 |
| FR-032.3 | System SHALL support live transcription of the meeting (speech-to-text) | P0 |
| FR-032.4 | Transcription SHALL identify speakers (speaker diarization) | P1 |
| FR-032.5 | System SHALL support transcription in English (with future multi-language support) | P0 |
| FR-032.6 | Transcription SHALL be saved automatically and linked to the meeting record | P0 |
| FR-032.7 | Users SHALL be able to edit/correct the transcription after the meeting | P1 |
| FR-032.8 | System SHALL support searching within transcriptions (full-text search) | P1 |
| FR-032.9 | System SHALL auto-generate meeting summary from transcription (key points, action items) | P2 |
| FR-032.10 | Notes and transcription SHALL be downloadable as PDF/DOCX | P1 |

### FR-033: Session Recording

| ID | Requirement | Priority |
|----|------------|----------|
| FR-033.1 | Host/organizer SHALL have the option to record a video session | P0 |
| FR-033.2 | Recording SHALL be opt-in — the host explicitly starts/stops recording | P0 |
| FR-033.3 | System SHALL notify all participants when recording starts/stops | P0 |
| FR-033.4 | Participants SHALL be able to consent/decline to being recorded (configurable by admin) | P1 |
| FR-033.5 | Recordings SHALL capture: video, audio, screen shares, and presentation slides | P0 |
| FR-033.6 | System SHALL support recording in multiple quality levels (720p, 1080p) | P1 |
| FR-033.7 | Recordings SHALL be automatically processed and stored in the Video Library (MOD-017) | P0 |
| FR-033.8 | System SHALL support server-side recording (not dependent on client machine) | P0 |
| FR-033.9 | Recordings SHALL be automatically linked to the meeting/session they belong to | P0 |
| FR-033.10 | System SHALL generate timestamps/chapters in recordings based on agenda items or time markers | P2 |

---

## 3.18 MOD-017: Video Learning Platform

### FR-034: Video Upload & Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-034.1 | Faculty SHALL be able to upload pre-recorded lecture videos | P0 |
| FR-034.2 | System SHALL support common video formats (MP4, MOV, AVI, MKV, WebM) | P0 |
| FR-034.3 | System SHALL automatically transcode uploaded videos for adaptive streaming (HLS/DASH) | P0 |
| FR-034.4 | System SHALL generate video thumbnails automatically | P0 |
| FR-034.5 | System SHALL support multiple quality levels (360p, 480p, 720p, 1080p) for each video | P0 |
| FR-034.6 | Video upload SHALL include metadata: title, description, subject, topic, tags, target audience (UG/PG/MD/MS etc.) | P0 |
| FR-034.7 | System SHALL support video upload size up to 2GB per file | P1 |
| FR-034.8 | System SHALL support resumable uploads (for large files / unreliable networks) | P1 |
| FR-034.9 | Faculty SHALL be able to replace/update a video while preserving watch history | P2 |

### FR-035: Video Library & Organization

| ID | Requirement | Priority |
|----|------------|----------|
| FR-035.1 | System SHALL organize videos into: College → Department → Subject → Topic hierarchy | P0 |
| FR-035.2 | System SHALL support video playlists / series (e.g., "Anatomy Lecture Series — Semester 1") | P0 |
| FR-035.3 | System SHALL support video categorization: Lecture, Tutorial, Demonstration, Case Study, Procedure Recording, Seminar, Guest Lecture | P0 |
| FR-035.4 | Videos SHALL be filterable by: department, subject, faculty, program level (UG/PG/MD/MS), topic, date | P0 |
| FR-035.5 | System SHALL support video search (title, description, tags, transcription content) | P0 |
| FR-035.6 | Faculty SHALL control video visibility: Draft, Published, Restricted (specific batches/students), Archived | P0 |
| FR-035.7 | System SHALL support linking videos to syllabus topics and teaching sessions | P1 |
| FR-035.8 | System SHALL show "Related Videos" recommendations based on subject/topic | P2 |

### FR-036: Video Streaming & Playback

| ID | Requirement | Priority |
|----|------------|----------|
| FR-036.1 | System SHALL provide adaptive bitrate streaming (auto-adjust quality based on bandwidth) | P0 |
| FR-036.2 | System SHALL support playback speed control (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x) | P0 |
| FR-036.3 | System SHALL support video bookmarks (students can bookmark timestamps) | P1 |
| FR-036.4 | System SHALL support in-video notes (students can take time-stamped notes while watching) | P1 |
| FR-036.5 | System SHALL support subtitles/captions (auto-generated from transcription + manual upload) | P1 |
| FR-036.6 | System SHALL support picture-in-picture mode (on web and mobile) | P2 |
| FR-036.7 | System SHALL support offline download for mobile app (with DRM/expiry) | P2 |
| FR-036.8 | System SHALL provide a mini-player for continued playback while navigating | P2 |
| FR-036.9 | Player SHALL support keyboard shortcuts (space=pause, arrows=seek, f=fullscreen) | P1 |

### FR-037: Watch Progress & Analytics

| ID | Requirement | Priority |
|----|------------|----------|
| FR-037.1 | System SHALL track watch progress per student per video (percentage watched, time spent) | P0 |
| FR-037.2 | System SHALL show "Continue Watching" for partially viewed videos | P0 |
| FR-037.3 | System SHALL mark videos as "Watched" when student completes viewing (configurable: 80%/90%/100%) | P0 |
| FR-037.4 | Faculty SHALL view video analytics: total views, unique viewers, avg watch time, completion rate | P0 |
| FR-037.5 | Faculty SHALL see which students have/haven't watched required videos | P0 |
| FR-037.6 | System SHALL support mandatory video assignments (student must watch before a deadline) | P1 |
| FR-037.7 | System SHALL generate video engagement reports per department/batch | P1 |
| FR-037.8 | System SHALL track most-rewatched segments (indicates difficult concepts) | P2 |

---

## 3.19 MOD-018: Multi-College / Institution Management

### FR-038: College Registration & Management

| ID | Requirement | Priority |
|----|------------|----------|
| FR-038.1 | Super Admin SHALL register new colleges/institutions on the platform | P0 |
| FR-038.2 | Each college SHALL have its own: admin, departments, faculty, students, settings | P0 |
| FR-038.3 | System SHALL support college-level branding (logo, name, colors on their portal) | P1 |
| FR-038.4 | System SHALL provide a College Admin dashboard with institution-specific metrics | P0 |
| FR-038.5 | System SHALL support college status management (Active, Suspended, Archived) | P0 |
| FR-038.6 | System SHALL support college-level subscription/plan management (if SaaS model) | P3 |

### FR-039: Cross-College Features

| ID | Requirement | Priority |
|----|------------|----------|
| FR-039.1 | Super Admin SHALL view a consolidated dashboard across all colleges | P0 |
| FR-039.2 | Super Admin SHALL run cross-college reports (enrollment, results, attendance) | P1 |
| FR-039.3 | System SHALL support cross-college faculty sharing (guest lectures) | P2 |
| FR-039.4 | System SHALL support centralized exam coordination across colleges (university-level exams) | P2 |
| FR-039.5 | System SHALL support cross-college video library sharing (opt-in by faculty) | P2 |
| FR-039.6 | System SHALL ensure complete data isolation between colleges by default (no data leaks) | P0 |
| FR-039.7 | System SHALL support college-specific result tracking with university-level consolidation | P1 |

### FR-040: College-Level Result & Assessment Tracking

| ID | Requirement | Priority |
|----|------------|----------|
| FR-040.1 | Each college SHALL independently manage their internal assessments and results | P0 |
| FR-040.2 | System SHALL support university exam result import (bulk upload from university) | P1 |
| FR-040.3 | System SHALL generate college-level result analysis (pass %, toppers, subject-wise performance) | P0 |
| FR-040.4 | System SHALL support result comparison across batches within a college | P1 |
| FR-040.5 | System SHALL support result comparison across colleges (Super Admin only, anonymized if needed) | P2 |
| FR-040.6 | System SHALL track both internal (college) and external (university) assessment results separately | P0 |
| FR-040.7 | System SHALL generate transcripts combining internal + external results | P1 |

---

## 3.20 Priority Legend

| Priority | Meaning | Phase |
|----------|---------|-------|
| **P0** | Must Have — System cannot launch without this | Phase 1 |
| **P1** | Should Have — Important for good user experience | Phase 1-2 |
| **P2** | Nice to Have — Enhances the system significantly | Phase 2 |
| **P3** | Future — Planned for later phases | Phase 3+ |
