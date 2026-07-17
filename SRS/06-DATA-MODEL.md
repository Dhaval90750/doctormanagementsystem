# 06 — Data Model & Database Design

> **Document Version:** 1.0.0-DRAFT  
> **Last Updated:** 2026-06-27  
> **Status:** 🟡 Draft

---

## 6.1 Database Strategy

- **Primary Database:** PostgreSQL 15+
- **Multi-Tenancy:** Schema-per-tenant (each college gets its own schema) with a shared `platform` schema
- **Caching:** Redis for sessions, frequently accessed data, real-time features
- **Search:** PostgreSQL Full-Text Search (upgrade to Elasticsearch if needed at scale)
- **File Storage:** S3-compatible object store (MinIO for self-hosted, AWS S3 for cloud)
- **Video Storage:** Dedicated bucket in S3 with CDN frontend

---

## 6.2 Schema Overview

```
Platform Schema (shared):
├── colleges
├── platform_users (super admins)
├── platform_settings
├── subscription_plans (future)
└── audit_logs_platform

College Schema (per tenant - e.g., schema "college_xyz"):
├── ─── CORE ───
├── users
├── roles
├── permissions
├── user_roles
├── permission_overrides
├── departments
├── units
│
├── ─── PEOPLE ───
├── student_profiles
├── faculty_profiles
├── batches
├── programs
│
├── ─── ACADEMIC ───
├── subjects
├── syllabus_topics
├── timetable_entries
├── teaching_sessions
├── session_resources
├── clinical_rotations
├── rotation_logs
│
├── ─── ASSESSMENT ───
├── assignments
├── assignment_submissions
├── examinations
├── exam_results
├── offline_assessments
├── offline_assessment_results
├── clinical_evaluations
├── grading_rules
│
├── ─── ATTENDANCE ───
├── attendance_records
├── attendance_corrections
│
├── ─── MEETINGS ───
├── meetings
├── meeting_participants
├── meeting_agendas
├── meeting_minutes
├── action_items
│
├── ─── NOTES & DOCS ───
├── notes
├── note_shares
├── documents
├── document_folders
│
├── ─── FACILITIES ───
├── facilities
├── facility_bookings
│
├── ─── VIDEO ───
├── video_rooms
├── video_room_participants
├── video_recordings
├── videos (uploaded/pre-recorded)
├── video_playlists
├── video_playlist_items
├── video_watch_progress
├── transcriptions
│
├── ─── COMMUNICATION ───
├── announcements
├── announcement_targets
├── notifications
├── notification_preferences
│
├── ─── SYSTEM ───
├── settings
├── master_data
├── audit_logs
└── file_metadata
```

---

## 6.3 Core Entity Definitions

### 6.3.1 Users

```sql
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone               VARCHAR(20),
    password_hash       VARCHAR(255) NOT NULL,
    full_name           VARCHAR(255) NOT NULL,
    date_of_birth       DATE,
    gender              VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer Not to Say')),
    profile_photo_url   TEXT,
    employee_student_id VARCHAR(50) UNIQUE,
    department_id       UUID REFERENCES departments(id),
    designation         VARCHAR(100),
    specialization      VARCHAR(255),
    qualifications      TEXT,
    joining_date        DATE,
    address             TEXT,
    emergency_contact   JSONB,  -- {name, phone, relation}
    blood_group         VARCHAR(5),
    bio                 TEXT,
    status              VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED')),
    is_first_login      BOOLEAN DEFAULT TRUE,
    last_login_at       TIMESTAMP WITH TIME ZONE,
    failed_login_count  INTEGER DEFAULT 0,
    locked_until        TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by          UUID REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_status ON users(status);
```

### 6.3.2 Roles & Permissions

```sql
CREATE TABLE roles (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              VARCHAR(50) NOT NULL UNIQUE,
    display_name      VARCHAR(100) NOT NULL,
    description       TEXT,
    is_system_role    BOOLEAN DEFAULT FALSE,
    hierarchy_level   INTEGER NOT NULL,  -- lower = more powerful
    is_active         BOOLEAN DEFAULT TRUE,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by        UUID REFERENCES users(id)
);

CREATE TABLE modules (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              VARCHAR(100) NOT NULL,
    code              VARCHAR(50) NOT NULL UNIQUE,
    description       TEXT,
    parent_module_id  UUID REFERENCES modules(id),
    is_active         BOOLEAN DEFAULT TRUE,
    display_order     INTEGER
);

CREATE TABLE permissions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id           UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    module_id         UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    action            VARCHAR(20) NOT NULL CHECK (action IN ('VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT', 'MANAGE', 'ASSIGN')),
    scope_level       VARCHAR(20) DEFAULT 'SELF' CHECK (scope_level IN ('GLOBAL', 'INSTITUTION', 'DEPARTMENT', 'UNIT', 'BATCH', 'SELF', 'SESSION')),
    is_granted        BOOLEAN DEFAULT TRUE,
    conditions        JSONB,  -- extra conditions like time-based, count-based
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by        UUID REFERENCES users(id),
    UNIQUE(role_id, module_id, action)
);

CREATE TABLE user_roles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id             UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    scope_entity_type   VARCHAR(50),  -- 'DEPARTMENT', 'UNIT', 'BATCH'
    scope_entity_id     UUID,         -- ID of the department/unit/batch
    assigned_by         UUID REFERENCES users(id),
    valid_from          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until         TIMESTAMP WITH TIME ZONE,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role_id, scope_entity_type, scope_entity_id)
);

CREATE TABLE permission_overrides (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id         UUID NOT NULL REFERENCES modules(id),
    action            VARCHAR(20) NOT NULL,
    is_granted        BOOLEAN NOT NULL,
    reason            TEXT,
    granted_by        UUID REFERENCES users(id),
    valid_from        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until       TIMESTAMP WITH TIME ZONE,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.3.3 Departments & Institution

```sql
CREATE TABLE departments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(20) NOT NULL UNIQUE,
    description     TEXT,
    hod_id          UUID REFERENCES users(id),
    contact_email   VARCHAR(255),
    contact_phone   VARCHAR(20),
    parent_dept_id  UUID REFERENCES departments(id),  -- for sub-units
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE programs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,  -- 'MBBS', 'MD', 'MS', etc.
    code            VARCHAR(20) NOT NULL UNIQUE,
    level           VARCHAR(30) NOT NULL CHECK (level IN ('UG', 'PG', 'SUPER_SPECIALTY', 'DIPLOMA', 'FELLOWSHIP')),
    duration_years  DECIMAL(3,1) NOT NULL,
    total_semesters INTEGER,
    department_id   UUID REFERENCES departments(id),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.3.4 Student Profiles

```sql
CREATE TABLE student_profiles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL UNIQUE REFERENCES users(id),
    enrollment_number   VARCHAR(50) NOT NULL UNIQUE,
    batch_id            UUID NOT NULL REFERENCES batches(id),
    program_id          UUID NOT NULL REFERENCES programs(id),
    current_year        INTEGER NOT NULL,
    current_semester    INTEGER,
    admission_date      DATE NOT NULL,
    admission_type      VARCHAR(30) CHECK (admission_type IN ('MERIT', 'MANAGEMENT', 'NRI', 'OTHER')),
    category            VARCHAR(30),
    previous_institution VARCHAR(255),
    guardian_name       VARCHAR(255) NOT NULL,
    guardian_contact    VARCHAR(20) NOT NULL,
    guardian_relation   VARCHAR(30) NOT NULL,
    student_status      VARCHAR(30) DEFAULT 'ACTIVE' CHECK (student_status IN ('ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'GRADUATED', 'DROPPED', 'INTERN')),
    graduation_date     DATE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE batches (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,  -- 'MBBS Batch 2024'
    code            VARCHAR(30) NOT NULL UNIQUE,
    program_id      UUID NOT NULL REFERENCES programs(id),
    start_year      INTEGER NOT NULL,
    end_year        INTEGER NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.3.5 Faculty Profiles

```sql
CREATE TABLE faculty_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL UNIQUE REFERENCES users(id),
    registration_number     VARCHAR(50),  -- Medical council registration
    experience_years        INTEGER,
    teaching_experience_years INTEGER,
    specialization_details  JSONB,  -- [{area, since, is_primary}]
    subjects                JSONB,  -- [{subject_id, competency_level}]
    max_teaching_hours_week INTEGER DEFAULT 20,
    is_visiting             BOOLEAN DEFAULT FALSE,
    visiting_valid_until    DATE,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 6.4 Academic Entities

### 6.4.1 Timetable & Sessions

```sql
CREATE TABLE timetable_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id      UUID NOT NULL REFERENCES subjects(id),
    faculty_id      UUID NOT NULL REFERENCES users(id),
    batch_id        UUID NOT NULL REFERENCES batches(id),
    facility_id     UUID REFERENCES facilities(id),
    day_of_week     INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    session_type    VARCHAR(30) NOT NULL CHECK (session_type IN ('LECTURE', 'TUTORIAL', 'PRACTICAL', 'SEMINAR', 'CLINICAL', 'CASE_DISCUSSION', 'GRAND_ROUND', 'JOURNAL_CLUB')),
    is_recurring    BOOLEAN DEFAULT TRUE,
    recurrence_rule TEXT,  -- RRULE format
    valid_from      DATE NOT NULL,
    valid_until     DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by      UUID REFERENCES users(id)
);

CREATE TABLE teaching_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timetable_entry_id  UUID REFERENCES timetable_entries(id),
    subject_id          UUID NOT NULL REFERENCES subjects(id),
    faculty_id          UUID NOT NULL REFERENCES users(id),
    batch_id            UUID NOT NULL REFERENCES batches(id),
    facility_id         UUID REFERENCES facilities(id),
    session_date        DATE NOT NULL,
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    session_type        VARCHAR(30) NOT NULL,
    topic_id            UUID REFERENCES syllabus_topics(id),
    topic_covered       TEXT,
    status              VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
    is_virtual          BOOLEAN DEFAULT FALSE,
    video_room_id       UUID REFERENCES video_rooms(id),
    recording_id        UUID REFERENCES video_recordings(id),
    feedback_enabled    BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6.4.2 Attendance

```sql
CREATE TABLE attendance_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES teaching_sessions(id),
    student_id      UUID NOT NULL REFERENCES users(id),
    status          VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'ON_DUTY')),
    marked_by       UUID REFERENCES users(id),
    marking_method  VARCHAR(20) CHECK (marking_method IN ('MANUAL', 'QR_CODE', 'BIOMETRIC', 'GEOLOCATION')),
    marked_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    device_info     JSONB,  -- for QR/geo: {device, location, ip}
    is_locked       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);

CREATE TABLE attendance_corrections (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_id       UUID NOT NULL REFERENCES attendance_records(id),
    requested_by        UUID NOT NULL REFERENCES users(id),
    requested_status    VARCHAR(20) NOT NULL,
    reason              TEXT NOT NULL,
    supporting_doc_url  TEXT,
    approved_by         UUID REFERENCES users(id),
    approval_status     VARCHAR(20) DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    approval_remarks    TEXT,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 6.5 Meeting Entities

```sql
CREATE TABLE meetings (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(500) NOT NULL,
    description         TEXT,
    meeting_type        VARCHAR(30) NOT NULL CHECK (meeting_type IN ('DEPARTMENTAL', 'FACULTY', 'ACADEMIC_COUNCIL', 'CLINICAL', 'JOURNAL_CLUB', 'CASE_REVIEW', 'ADMINISTRATIVE', 'COMMITTEE', 'ONE_ON_ONE')),
    organizer_id        UUID NOT NULL REFERENCES users(id),
    start_time          TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time            TIMESTAMP WITH TIME ZONE NOT NULL,
    location_type       VARCHAR(20) CHECK (location_type IN ('PHYSICAL', 'VIRTUAL', 'HYBRID')),
    facility_id         UUID REFERENCES facilities(id),
    video_room_id       UUID REFERENCES video_rooms(id),
    is_recurring        BOOLEAN DEFAULT FALSE,
    recurrence_rule     TEXT,
    parent_meeting_id   UUID REFERENCES meetings(id),  -- for recurring instances
    status              VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED')),
    recording_enabled   BOOLEAN DEFAULT FALSE,
    transcription_enabled BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE meeting_participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id      UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    role            VARCHAR(20) DEFAULT 'PARTICIPANT' CHECK (role IN ('ORGANIZER', 'CO_ORGANIZER', 'SECRETARY', 'PRESENTER', 'PARTICIPANT')),
    rsvp_status     VARCHAR(20) DEFAULT 'PENDING' CHECK (rsvp_status IN ('PENDING', 'ACCEPTED', 'TENTATIVE', 'DECLINED')),
    attended        BOOLEAN,
    joined_at       TIMESTAMP WITH TIME ZONE,
    left_at         TIMESTAMP WITH TIME ZONE,
    UNIQUE(meeting_id, user_id)
);

CREATE TABLE meeting_agendas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id      UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    presenter_id    UUID REFERENCES users(id),
    duration_minutes INTEGER,
    display_order   INTEGER NOT NULL,
    status          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DISCUSSED', 'DEFERRED', 'SKIPPED')),
    notes           TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE meeting_minutes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id      UUID NOT NULL REFERENCES meetings(id),
    content         TEXT NOT NULL,  -- Rich text / Markdown
    recorded_by     UUID NOT NULL REFERENCES users(id),
    version         INTEGER DEFAULT 1,
    is_published    BOOLEAN DEFAULT FALSE,
    published_at    TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE action_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id      UUID REFERENCES meetings(id),
    agenda_item_id  UUID REFERENCES meeting_agendas(id),
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    assignee_id     UUID NOT NULL REFERENCES users(id),
    assigned_by     UUID NOT NULL REFERENCES users(id),
    due_date        DATE NOT NULL,
    priority        VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status          VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'DONE', 'OVERDUE', 'CANCELLED')),
    completed_at    TIMESTAMP WITH TIME ZONE,
    comments        JSONB DEFAULT '[]',  -- [{user_id, comment, timestamp}]
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_action_items_assignee ON action_items(assignee_id);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);
```

---

## 6.6 Video & Media Entities

```sql
CREATE TABLE video_rooms (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code           VARCHAR(50) NOT NULL UNIQUE,
    title               VARCHAR(500),
    host_id             UUID NOT NULL REFERENCES users(id),
    room_type           VARCHAR(20) CHECK (room_type IN ('MEETING', 'LECTURE', 'WEBINAR', 'ONE_ON_ONE')),
    max_participants    INTEGER DEFAULT 50,
    password_hash       VARCHAR(255),
    waiting_room_enabled BOOLEAN DEFAULT FALSE,
    recording_enabled   BOOLEAN DEFAULT FALSE,
    transcription_enabled BOOLEAN DEFAULT FALSE,
    status              VARCHAR(20) DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'ACTIVE', 'ENDED')),
    started_at          TIMESTAMP WITH TIME ZONE,
    ended_at            TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE video_room_participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID NOT NULL REFERENCES video_rooms(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    role            VARCHAR(20) DEFAULT 'PARTICIPANT' CHECK (role IN ('HOST', 'CO_HOST', 'PRESENTER', 'PARTICIPANT')),
    joined_at       TIMESTAMP WITH TIME ZONE,
    left_at         TIMESTAMP WITH TIME ZONE,
    is_muted        BOOLEAN DEFAULT FALSE,
    is_camera_off   BOOLEAN DEFAULT FALSE,
    connection_quality VARCHAR(10) CHECK (connection_quality IN ('GOOD', 'FAIR', 'POOR')),
    UNIQUE(room_id, user_id)
);

CREATE TABLE video_recordings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID REFERENCES video_rooms(id),
    session_id      UUID REFERENCES teaching_sessions(id),
    meeting_id      UUID REFERENCES meetings(id),
    title           VARCHAR(500),
    storage_url     TEXT NOT NULL,
    duration_seconds INTEGER,
    file_size_bytes BIGINT,
    status          VARCHAR(20) DEFAULT 'PROCESSING' CHECK (status IN ('RECORDING', 'PROCESSING', 'READY', 'FAILED', 'DELETED')),
    quality         VARCHAR(10) CHECK (quality IN ('720p', '1080p')),
    recorded_by     UUID REFERENCES users(id),
    started_at      TIMESTAMP WITH TIME ZONE,
    ended_at        TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pre-recorded / Uploaded Videos
CREATE TABLE videos (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(500) NOT NULL,
    description         TEXT,
    uploaded_by         UUID NOT NULL REFERENCES users(id),
    department_id       UUID REFERENCES departments(id),
    subject_id          UUID REFERENCES subjects(id),
    topic_id            UUID REFERENCES syllabus_topics(id),
    session_id          UUID REFERENCES teaching_sessions(id),
    recording_id        UUID REFERENCES video_recordings(id),  -- if from a recording
    category            VARCHAR(30) CHECK (category IN ('LECTURE', 'TUTORIAL', 'DEMONSTRATION', 'CASE_STUDY', 'PROCEDURE', 'SEMINAR', 'GUEST_LECTURE', 'RECORDING')),
    target_program_level VARCHAR(30),  -- 'UG', 'PG', 'MD', 'MS', 'ALL'
    target_batch_id     UUID REFERENCES batches(id),
    tags                TEXT[],
    original_url        TEXT NOT NULL,
    thumbnail_url       TEXT,
    duration_seconds    INTEGER,
    file_size_bytes     BIGINT,
    -- Transcoded variants stored in separate table or as JSONB
    variants            JSONB DEFAULT '[]',  -- [{quality: '720p', url: '...', size: 1234}]
    hls_manifest_url    TEXT,
    subtitle_url        TEXT,
    visibility          VARCHAR(20) DEFAULT 'DRAFT' CHECK (visibility IN ('DRAFT', 'PUBLISHED', 'RESTRICTED', 'ARCHIVED')),
    processing_status   VARCHAR(20) DEFAULT 'PENDING' CHECK (processing_status IN ('PENDING', 'TRANSCODING', 'READY', 'FAILED')),
    view_count          INTEGER DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_videos_department ON videos(department_id);
CREATE INDEX idx_videos_subject ON videos(subject_id);
CREATE INDEX idx_videos_visibility ON videos(visibility);
CREATE INDEX idx_videos_uploaded_by ON videos(uploaded_by);

CREATE TABLE video_watch_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id        UUID NOT NULL REFERENCES videos(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    watched_seconds INTEGER DEFAULT 0,
    total_seconds   INTEGER NOT NULL,
    percentage      DECIMAL(5,2) DEFAULT 0,
    is_completed    BOOLEAN DEFAULT FALSE,
    last_position   INTEGER DEFAULT 0,  -- resume position in seconds
    watch_count     INTEGER DEFAULT 1,
    bookmarks       JSONB DEFAULT '[]',  -- [{timestamp, note}]
    first_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_watched_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(video_id, user_id)
);

CREATE TABLE transcriptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type     VARCHAR(20) NOT NULL CHECK (source_type IN ('VIDEO_ROOM', 'VIDEO', 'RECORDING')),
    source_id       UUID NOT NULL,  -- room_id, video_id, or recording_id
    content         TEXT NOT NULL,   -- full transcription text
    segments        JSONB NOT NULL,  -- [{start_time, end_time, speaker, text}]
    language        VARCHAR(10) DEFAULT 'en',
    is_auto_generated BOOLEAN DEFAULT TRUE,
    is_edited       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transcriptions_source ON transcriptions(source_type, source_id);
```

---

## 6.7 Notes & Documents Entities

```sql
CREATE TABLE notes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    content         TEXT NOT NULL,  -- Rich text / Markdown
    author_id       UUID NOT NULL REFERENCES users(id),
    folder_id       UUID REFERENCES document_folders(id),
    session_id      UUID REFERENCES teaching_sessions(id),
    subject_id      UUID REFERENCES subjects(id),
    tags            TEXT[],
    category        VARCHAR(30),
    is_pinned       BOOLEAN DEFAULT FALSE,
    is_template     BOOLEAN DEFAULT FALSE,
    template_type   VARCHAR(30),  -- 'CASE_DISCUSSION', 'LECTURE_NOTES', etc.
    version         INTEGER DEFAULT 1,
    visibility      VARCHAR(20) DEFAULT 'PRIVATE' CHECK (visibility IN ('PRIVATE', 'SHARED', 'PUBLIC')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE note_shares (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id         UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
    shared_with_type VARCHAR(20) NOT NULL CHECK (shared_with_type IN ('USER', 'ROLE', 'DEPARTMENT', 'BATCH', 'ALL')),
    shared_with_id  UUID,  -- NULL if shared_with_type is 'ALL'
    permission      VARCHAR(20) DEFAULT 'VIEW' CHECK (permission IN ('VIEW', 'COMMENT', 'EDIT')),
    shared_by       UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(500) NOT NULL,
    file_url        TEXT NOT NULL,
    file_type       VARCHAR(20) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    folder_id       UUID REFERENCES document_folders(id),
    department_id   UUID REFERENCES departments(id),
    category        VARCHAR(30) CHECK (category IN ('SYLLABUS', 'STUDY_MATERIAL', 'QUESTION_PAPER', 'CIRCULAR', 'NOTICE', 'TEMPLATE', 'OTHER')),
    uploaded_by     UUID NOT NULL REFERENCES users(id),
    version         INTEGER DEFAULT 1,
    description     TEXT,
    tags            TEXT[],
    download_count  INTEGER DEFAULT 0,
    visibility      VARCHAR(20) DEFAULT 'DEPARTMENT',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 6.8 Assessment Entities

```sql
CREATE TABLE offline_assessments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(500) NOT NULL,
    assessment_type     VARCHAR(30) NOT NULL CHECK (assessment_type IN ('WRITTEN', 'PRACTICAL', 'VIVA', 'OSCE', 'CLINICAL', 'LAB', 'SEMINAR', 'PRESENTATION')),
    department_id       UUID NOT NULL REFERENCES departments(id),
    subject_id          UUID NOT NULL REFERENCES subjects(id),
    batch_id            UUID NOT NULL REFERENCES batches(id),
    program_id          UUID NOT NULL REFERENCES programs(id),
    conducted_date      DATE NOT NULL,
    venue               VARCHAR(255),
    max_marks           DECIMAL(6,2) NOT NULL,
    passing_marks       DECIMAL(6,2) NOT NULL,
    -- Multi-component support
    components          JSONB DEFAULT '[]',  -- [{name: 'Theory', max_marks: 60, weightage: 0.6}, ...]
    internal_examiner_id UUID REFERENCES users(id),
    external_examiner_name VARCHAR(255),
    status              VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'MARKS_ENTERED', 'SUBMITTED', 'APPROVED', 'PUBLISHED')),
    approved_by         UUID REFERENCES users(id),
    approved_at         TIMESTAMP WITH TIME ZONE,
    created_by          UUID NOT NULL REFERENCES users(id),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE offline_assessment_results (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id       UUID NOT NULL REFERENCES offline_assessments(id),
    student_id          UUID NOT NULL REFERENCES users(id),
    component_marks     JSONB DEFAULT '{}',  -- {component_name: marks}
    total_marks         DECIMAL(6,2),
    grade               VARCHAR(5),
    is_pass             BOOLEAN,
    remarks             TEXT,
    entered_by          UUID NOT NULL REFERENCES users(id),
    entered_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assessment_id, student_id)
);
```

---

## 6.9 Entity Relationship Summary

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   College   │────<│  Department  │────<│    Unit      │
└─────────────┘     └──────┬───────┘     └──────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼───────┐  ┌───────▼───────┐  ┌───────▼───────┐
│   Programs    │  │   Faculty     │  │   Subjects    │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
┌───────▼───────┐  ┌───────▼───────┐  ┌───────▼───────┐
│   Batches     │  │  Timetable   │  │   Syllabus    │
└───────┬───────┘  │   Entries    │  │   Topics      │
        │          └───────┬───────┘  └───────┬───────┘
┌───────▼───────┐          │                  │
│   Students    │  ┌───────▼───────┐          │
└───────┬───────┘  │   Teaching   │◄─────────┘
        │          │   Sessions   │
        │          └───┬───┬───┬──┘
        │              │   │   │
   ┌────┘      ┌───────┘   │   └──────────┐
   │           │           │              │
┌──▼───────┐ ┌─▼────────┐ ┌▼───────────┐ ┌▼─────────────┐
│Attendance│ │  Notes    │ │Video Rooms │ │ Assessments  │
│ Records  │ │& Resources│ │& Recordings│ │(Online+Offline│
└──────────┘ └──────────┘ └────────────┘ └──────────────┘

┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  Meetings   │────<│  Agendas     │────<│Action Items  │
└──────┬──────┘     └──────────────┘     └──────────────┘
       │
       ├────────< Meeting Participants
       ├────────< Meeting Minutes
       ├────────< Video Room (if virtual)
       └────────< Transcription
       
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Videos    │────<│  Playlists   │     │Watch Progress│
│ (Library)   │     │  & Series    │     │  (per user)  │
└──────┬──────┘     └──────────────┘     └──────────────┘
       │
       ├────────< Transcription
       ├────────< Subtitles
       └────────< Watch Progress
```

---

## 6.10 Multi-Tenancy Strategy

```
Database: dsms_platform
├── Schema: platform       (shared — colleges, super admin, platform settings)
├── Schema: college_001    (College A's data — fully isolated)
├── Schema: college_002    (College B's data — fully isolated)
├── Schema: college_003    (College C's data — fully isolated)
└── ...

Each college schema has identical table structure.
Application sets search_path based on authenticated user's college.
Cross-college queries only available to Super Admin via platform schema views.
```

> [!IMPORTANT]
> The schema-per-tenant approach ensures complete data isolation while keeping all colleges in a single database for easier management. If a college needs dedicated infrastructure later, their schema can be migrated to a separate database.
