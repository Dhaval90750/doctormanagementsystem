# 01 — Introduction & Vision

> **Document Version:** 1.0.0-DRAFT  
> **Last Updated:** 2026-06-27  
> **Status:** 🟡 Draft

---

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete requirements for the **Doctor Student Management System (DSMS)** — a comprehensive platform designed to manage the entire lifecycle of medical education institutions, including student management, faculty/doctor coordination, teaching schedules, clinical rotations, meetings, notes, assessments, and institutional administration.

The system will serve as the **single source of truth** for all academic, administrative, and clinical teaching activities within a medical education institution (medical college, teaching hospital, residency program, etc.).

---

## 1.2 Project Vision

> *"A unified, intelligent platform that empowers medical education institutions to seamlessly manage students, faculty, clinical teaching, assessments, meetings, and administrative workflows — accessible anytime, anywhere, on any device."*

### Core Principles
1. **Unified Experience** — One system for students, faculty, admin, and management
2. **Mobile-First, Web-Complete** — Full functionality on mobile; advanced admin on web
3. **Role-Based Everything** — Every action governed by configurable access control
4. **Real-Time Collaboration** — Live updates, notifications, and shared workspaces
5. **Data-Driven Decisions** — Analytics and reports for every stakeholder

---

## 1.3 Scope

### 1.3.1 In Scope

| Area | Coverage |
|------|----------|
| **Student Management** | Enrollment, profiles, academic records, attendance, progress tracking |
| **Faculty/Doctor Management** | Profiles, specializations, teaching assignments, availability |
| **Teaching Management** | Curriculum, timetables, lectures, clinical rotations, case discussions |
| **Assessment & Evaluation** | Exams, assignments, clinical evaluations, grading, feedback |
| **Meeting Management** | Schedule, agenda, minutes, action items, recurring meetings |
| **Notes & Documentation** | Clinical notes, lecture notes, shared documents, templates |
| **Place/Facility Management** | Rooms, labs, OTs, OPDs, wards — booking and scheduling |
| **Attendance Management** | Biometric/QR/manual attendance for lectures, rotations, duties |
| **Communication** | Announcements, notifications (push + in-app), messaging |
| **Video Conferencing (Built-in)** | WebRTC-based live video calls, screen sharing, in-call notes, live transcription |
| **Session Recording & Playback** | Record live sessions (opt-in), upload pre-recorded lectures, video library |
| **Video Learning Platform** | Upload, organize, and stream educational videos for UG/PG/MD/MS students |
| **Multi-College Support** | Multiple colleges/institutions on one platform with isolated data |
| **Offline Assessment Tracking** | Record and track results of physical/offline exams, practicals, vivas |
| **Reports & Analytics** | Dashboards, exportable reports, trend analysis |
| **Access Control (RBAC)** | Predefined roles with editable permissions |
| **Mobile App** | Android + iOS (or cross-platform) with offline support |
| **Web Application** | Full-featured responsive web app |

### 1.3.2 Out of Scope (Phase 1)

| Area | Reason |
|------|--------|
| Patient Management (EMR/EHR) | Separate system — may integrate later |
| Billing & Financial Management | Separate accounting system |
| Research Paper Management | Future phase |
| AI-Powered Learning Recommendations | Future phase |

---

## 1.4 Stakeholders

### Primary Stakeholders

| Stakeholder | Role in System | Key Interests |
|-------------|---------------|---------------|
| **Super Admin** | System owner, full control | System configuration, user management, data integrity |
| **Institution Admin** | Day-to-day institutional management | Schedules, reports, faculty management |
| **HOD (Head of Department)** | Department-level oversight | Department performance, faculty allocation, curriculum |
| **Senior Doctor / Professor** | Teaching, mentoring, evaluation | Teaching schedule, student performance, clinical cases |
| **Junior Doctor / Resident** | Learning, clinical duties | Rotation schedule, assignments, feedback |
| **Student (UG/PG)** | Academic activities | Timetable, attendance, grades, notes |
| **Administrative Staff** | Operational support | Data entry, scheduling, report generation |
| **Examination Cell** | Assessment management | Exam scheduling, result processing |

### Secondary Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| **University / Regulatory Body** | Compliance, accreditation data |
| **Parents / Guardians** | Student progress (limited access) |
| **IT Department** | System maintenance, security |

---

## 1.5 System Context

```
┌──────────────────────────────────────────────────────────────────┐
│                        DSMS Platform                             │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Web App  │  │Mobile App│  │  Admin   │  │ College  │        │
│  │ (Next.js) │  │(Android/ │  │  Panel   │  │  Portal  │        │
│  │          │  │  iOS)    │  │  (Web)   │  │  (Web)   │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       │              │              │              │              │
│       └──────────────┴──────────────┴──────────────┘              │
│                              │                                   │
│                ┌─────────────▼─────────────┐                     │
│                │      API Gateway          │                     │
│                │   (REST + WebSocket)      │                     │
│                └─────────────┬─────────────┘                     │
│                              │                                   │
│  ┌──────┬──────┬─────┬───────┼───────┬──────┬──────┬──────┐      │
│  │Auth  │Users │Teach│ Video │ Meet  │Notes │Places│Media │      │
│  │Svc   │Svc   │Svc  │ Conf  │ Svc   │Svc   │Svc   │Svc   │      │
│  │      │      │     │(WebRTC│       │      │      │(VOD) │      │
│  │      │      │     │+TURN) │       │      │      │      │      │
│  └──┬───┘└──┬──┘└──┬─┘└──┬───┘└──┬───┘└──┬──┘└──┬──┘└──┬──┘      │
│     └───────┴──────┴─────┴──────┴──────┴──────┴──────┘           │
│                              │                                   │
│          ┌───────────────────┼────────────────────┐              │
│          │                   │                    │              │
│  ┌───────▼───────┐  ┌───────▼───────┐  ┌─────────▼─────────┐    │
│  │   Database    │  │  Object Store │  │   Media Server    │    │
│  │ (PostgreSQL)  │  │  (S3/MinIO)   │  │ (Video Streaming) │    │
│  └───────────────┘  └───────────────┘  └───────────────────┘    │
└──────────────────────────────────────────────────────────────────┘

Internal Services:
├── WebRTC Signaling Server (for live video conferencing)
├── TURN/STUN Server (NAT traversal for video calls)
├── Media Recording Service (session recording)
├── Transcription Engine (live + post-session transcription)
├── Video Transcoding Service (for uploaded/recorded videos)
└── Streaming Server (HLS/DASH for video playback)

External Integrations:
├── Email Service (SMTP / SendGrid)
├── Push Notifications (FCM / APNs)
├── Calendar Sync (Google Calendar / Outlook)
├── File/Video Storage (S3 / MinIO)
└── SMS Gateway (optional)
```

---

## 1.6 Assumptions

1. The institution has a **stable internet connection** for primary usage (offline mode available for mobile)
2. Users have access to **modern smartphones** (Android 8+ / iOS 14+) or **web browsers** (Chrome, Firefox, Safari, Edge — latest 2 versions)
3. The institution follows a **departmental hierarchy** (Institution → Department → Unit/Division)
4. **Academic calendar** follows a semester or annual system
5. Clinical rotations follow a **posting schedule** defined by the department
6. The institution has an existing **student enrollment process** — DSMS will manage post-enrollment
7. A **Super Admin** will be responsible for initial system setup and configuration
8. The system will **not replace** existing EMR/EHR systems but may integrate with them in future phases

---

## 1.7 Constraints

| Constraint | Description |
|-----------|-------------|
| **Regulatory** | Must comply with data protection regulations (IT Act, potential DPDP Act compliance) |
| **Data Residency** | All data must be stored within Indian data centers (if deployed for Indian institutions) |
| **Accessibility** | Must support basic accessibility standards (WCAG 2.1 Level AA) |
| **Language** | Primary language is English; UI should support future localization |
| **Concurrent Users** | Must support at least 500 concurrent users per institution |
| **Uptime** | 99.5% uptime during academic hours (8 AM - 10 PM) |
| **Mobile Data** | Mobile app should be optimized for low-bandwidth scenarios |

---

## 1.8 Dependencies

| Dependency | Type | Description |
|-----------|------|-------------|
| PostgreSQL 15+ | Infrastructure | Primary database |
| Redis | Infrastructure | Caching and session management |
| S3-compatible storage | Infrastructure | File/document storage |
| SMTP Server | External | Email notifications |
| FCM / APNs | External | Push notifications |
| OAuth 2.0 Provider | External | Optional SSO integration |

---

## 1.9 Document Conventions

| Convention | Meaning |
|-----------|---------|
| **SHALL** | Mandatory requirement |
| **SHOULD** | Recommended but not mandatory |
| **MAY** | Optional feature |
| **FR-XXX** | Functional Requirement ID |
| **NFR-XXX** | Non-Functional Requirement ID |
| **UC-XXX** | Use Case ID |
| **MOD-XXX** | Module ID |

---

> [!NOTE]
> This introduction sets the foundation. All subsequent documents reference the scope and conventions defined here. Any scope changes must be reflected in this document first.
