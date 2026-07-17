# 08 — UI/UX Flows & Screen Descriptions

> **Document Version:** 1.0.0-DRAFT  
> **Last Updated:** 2026-06-27  
> **Status:** 🟡 Draft

---

## 8.1 Design Principles

| Principle | Description |
|-----------|-------------|
| **Mobile-First** | Design for mobile first, then scale up to desktop |
| **Role-Aware UI** | Interface adapts based on user's role — different dashboards, menus, actions |
| **Consistent** | Unified design language across web and mobile |
| **Contextual** | Show relevant information based on context (department, subject, session) |
| **Minimal Clicks** | Core tasks achievable in ≤ 3 clicks |
| **Progressive Disclosure** | Show essential info first, details on demand |
| **Dark Mode Ready** | Support light and dark themes |

---

## 8.2 Navigation Structure

### Web App Navigation (Sidebar)

```
┌─ Dashboard (role-specific)
├─ My Schedule
│   ├─ Today's Sessions
│   ├─ Timetable (Week/Month)
│   └─ Clinical Rotations
├─ Teaching (Faculty only)
│   ├─ My Sessions
│   ├─ Take Attendance
│   ├─ Syllabus Coverage
│   └─ Assignments
├─ Meetings
│   ├─ Upcoming
│   ├─ Past Meetings
│   ├─ Action Items
│   └─ Schedule New
├─ Video
│   ├─ Start/Join Call
│   ├─ Video Library
│   ├─ My Uploads
│   ├─ Continue Watching
│   └─ Playlists
├─ Notes
│   ├─ My Notes
│   ├─ Shared with Me
│   ├─ Templates
│   └─ Documents
├─ Assessments
│   ├─ Assignments
│   ├─ Exam Schedule
│   ├─ Results
│   └─ Offline Assessments
├─ Attendance
│   ├─ My Attendance (student)
│   └─ Attendance Reports (faculty/admin)
├─ Reports & Analytics (admin/HOD)
├─ People
│   ├─ Students
│   ├─ Faculty
│   └─ Directory
├─ Facilities (admin)
│   ├─ Room Booking
│   └─ Manage Facilities
├─ Announcements
├─ Administration (admin only)
│   ├─ Departments
│   ├─ Programs & Batches
│   ├─ Roles & Permissions
│   ├─ System Settings
│   └─ Audit Logs
└─ College Management (Super Admin)
    ├─ Colleges
    ├─ Cross-College Reports
    └─ Platform Settings
```

### Mobile App Navigation (Bottom Tab Bar)

```
┌────────────────────────────────────────────────────────┐
│                    [App Content]                        │
│                                                        │
├────────┬──────────┬──────────┬──────────┬─────────────┤
│  Home  │ Schedule │  Video   │  Notes   │   More      │
│   🏠   │   📅     │   🎥    │   📝     │   ☰        │
└────────┴──────────┴──────────┴──────────┴─────────────┘

"More" menu expands to:
├── Meetings
├── Assessments
├── Attendance
├── Announcements
├── Reports (if authorized)
├── People Directory
├── Settings
└── Profile
```

---

## 8.3 Key Screen Descriptions

### 8.3.1 Login Screen

```
┌──────────────────────────────────┐
│         [Institution Logo]       │
│    Doctor Student Management     │
│            System                │
│                                  │
│  ┌────────────────────────────┐  │
│  │ 📧 Email / Phone          │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │ 🔒 Password          👁️   │  │
│  └────────────────────────────┘  │
│                                  │
│  ☐ Remember Me    Forgot Password│
│                                  │
│  ┌────────────────────────────┐  │
│  │          LOGIN             │  │
│  └────────────────────────────┘  │
│                                  │
│  ──── OR ────                    │
│                                  │
│  [Login with OTP]                │
│  [Login with Biometric] (mobile) │
│                                  │
│  [Google SSO] [Microsoft SSO]    │
│              (future)            │
└──────────────────────────────────┘
```

---

### 8.3.2 Role-Specific Dashboards

#### Super Admin Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│  DSMS Platform Dashboard                        🔔 ⚙️ 👤      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Colleges │  │ Total    │  │ Active   │  │ Live     │      │
│  │    12    │  │ Users    │  │ Sessions │  │ Video    │      │
│  │          │  │  8,450   │  │    34    │  │ Calls: 8 │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌─────────────────────────────┐  ┌────────────────────────┐  │
│  │ College-Wise Statistics     │  │  System Health         │  │
│  │ ┌───────────────────────┐   │  │  CPU: ██████░░ 72%     │  │
│  │ │ [Bar Chart - Students │   │  │  RAM: █████░░░ 58%     │  │
│  │ │  per College]         │   │  │  Disk: ███░░░░░ 34%    │  │
│  │ └───────────────────────┘   │  │  API: ✅ Healthy       │  │
│  └─────────────────────────────┘  │  Video: ✅ Healthy     │  │
│                                    └────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Recent Activity                                          │  │
│  │ • College ABC added 50 new students          2 hours ago │  │
│  │ • College XYZ published semester results      4 hours ago │  │
│  │ • New college "DEF Medical" registered        1 day ago   │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### Faculty Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│  Good Morning, Dr. Sharma                    🔔(3) ⚙️ 👤      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ── Today's Schedule ──────────────────────────────────────     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟢 09:00 - 10:00  │ Anatomy Lecture     │ Hall 3  │ MBBS │  │
│  │                    │ Topic: Brachial     │ Yr 2    │ [Go  │  │
│  │                    │ Plexus              │         │ Live]│  │
│  ├────────────────────┼─────────────────────┼─────────┼──────┤  │
│  │ 🔵 11:00 - 12:00  │ PG Case Discussion  │ Seminar │ MD   │  │
│  │                    │ Topic: Cardiac      │ Room 1  │      │  │
│  ├────────────────────┼─────────────────────┼─────────┼──────┤  │
│  │ 🟡 14:00 - 15:00  │ Clinical Posting    │ Ward 4  │ Intern│ │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────┐  ┌───────────────────────────────┐  │
│  │ Quick Actions        │  │  Upcoming                     │  │
│  │                      │  │                               │  │
│  │ [📷 Take Attendance] │  │  📅 Dept Meeting    Tomorrow  │  │
│  │ [📹 Start Video Call]│  │  📝 Assignment Due   3 days   │  │
│  │ [📤 Upload Video]   │  │  🏥 Ward Round      Friday   │  │
│  │ [📝 Create Notes]   │  │  📊 Results Due     Next Week │  │
│  └──────────────────────┘  └───────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────┐  ┌───────────────────────────────┐  │
│  │  My Action Items (5) │  │  Pending Reviews              │  │
│  │                      │  │                               │  │
│  │ ⚠️ Complete syllabus │  │  📄 3 Case Logs awaiting     │  │
│  │    plan — Due Today  │  │  📝 5 Assignment submissions  │  │
│  │ ⬜ Review PG case    │  │  ✅ 2 Attendance corrections  │  │
│  │    logs — Due Fri    │  │                               │  │
│  └──────────────────────┘  └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

#### Student Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│  Hello, Priya                                🔔(5) 👤          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ── Today's Schedule ──────────────────────────────────────     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✅ 09:00 Anatomy Lecture    │ Completed │ Attended      │   │
│  │ 🟢 11:00 Physiology Lab    │ Now       │ [Join]        │   │
│  │ ⏳ 14:00 Clinical Posting   │ Upcoming  │ Ward 2        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌───────────────┐  ┌────────────┐  ┌──────────────┐         │
│  │ Attendance    │  │ Assignments│  │ Latest       │         │
│  │               │  │            │  │ Results      │         │
│  │   ████ 82%   │  │  📋 2 Due  │  │              │         │
│  │  ▓▓▓▓▓▓▓▓   │  │  Soon      │  │  Anatomy: A  │         │
│  │  Target: 75% │  │            │  │  Physio: B+  │         │
│  └───────────────┘  └────────────┘  └──────────────┘         │
│                                                                 │
│  ── Continue Watching ─────────────────────────────────────    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                      │
│  │ [thumb] │  │ [thumb] │  │ [thumb] │                      │
│  │ Cardiac │  │ Neuro   │  │ Pharm   │                      │
│  │ Anatomy │  │ Pathways│  │ Kinetics│                      │
│  │ ██░░ 45%│  │ █░░░ 20%│  │ ███░ 70%│                      │
│  └─────────┘  └─────────┘  └─────────┘                      │
│                                                                 │
│  ── Announcements ─────────────────────────────────────────    │
│  ⚠️ Internal Assessment 2 schedule published — View           │
│  📢 Holiday on July 3 — Independence Day                      │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.3.3 Video Conferencing Screen

```
┌────────────────────────────────────────────────────────────────────────┐
│  Anatomy Lecture — Dr. Sharma              🔴 REC   👥 32   ⏱ 34:12  │
├───────────────────────────────────────────────┬────────────────────────┤
│                                               │                        │
│   ┌─────────────────────────────────────┐    │  📝 Notes    📜 Chat   │
│   │                                     │    │                        │
│   │         [Main Video Feed]           │    │  Dr. Sharma:           │
│   │                                     │    │  The brachial plexus   │
│   │      Dr. Sharma (Presenting)        │    │  originates from the   │
│   │                                     │    │  ventral rami of C5    │
│   │  ┌──────┐ ┌──────┐ ┌──────┐       │    │  to T1...              │
│   │  │ P1   │ │ P2   │ │ P3   │       │    │                        │
│   │  └──────┘ └──────┘ └──────┘       │    │  [Live Transcription]  │
│   │  ┌──────┐ ┌──────┐ ┌──────┐       │    │                        │
│   │  │ P4   │ │ P5   │ │ +27  │       │    │  ── Notes Panel ──     │
│   │  └──────┘ └──────┘ └──────┘       │    │                        │
│   └─────────────────────────────────────┘    │  Key Points:           │
│                                               │  • C5-T1 ventral rami │
│   ┌──────────────────────────────────────┐   │  • Upper trunk: C5,C6  │
│   │ 🎤  📷  🖥️  ✋  😊  📝  ⏺️  🚪   │   │  • ...                 │
│   │ Mic Cam Share Raise React Notes Rec End  │  │                        │
│   └──────────────────────────────────────┘   │  [Type notes here...] │
│                                               │                        │
└───────────────────────────────────────────────┴────────────────────────┘
```

**Mobile Video Call:**
```
┌──────────────────────┐
│ Anatomy — Dr. Sharma │
│ 🔴 REC  👥 32  34:12│
├──────────────────────┤
│                      │
│  ┌──────────────┐    │
│  │              │    │
│  │  [Speaker    │    │
│  │   Video]     │    │
│  │              │    │
│  │  Dr. Sharma  │    │
│  └──────────────┘    │
│                      │
│  ┌────┐ ┌────┐      │
│  │ P1 │ │ P2 │ +30  │
│  └────┘ └────┘      │
│                      │
│  💬 Transcription:   │
│  "...the upper trunk │
│   is formed by C5..."│
│                      │
├──────────────────────┤
│ 🎤  📷  🖥️ ✋ 📝 🚪│
└──────────────────────┘
```

---

### 8.3.4 Video Library Screen

```
┌──────────────────────────────────────────────────────────────────────┐
│  Video Library                    🔍 Search videos...     [Upload]  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Filters: [Department ▼] [Subject ▼] [Level: UG/PG/MD ▼] [Type ▼] │
│                                                                      │
│  ── Continue Watching ───────────────────────────────────────────    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐     │
│  │ [Thumbnail]│  │ [Thumbnail]│  │ [Thumbnail]│  │   → See  │     │
│  │ ████░░ 60% │  │ ██░░░░ 30% │  │ ██████░ 85%│  │   All    │     │
│  │ Heart      │  │ Renal      │  │ Pharmacol  │  │          │     │
│  │ Anatomy    │  │ Physiology │  │ -okinetics │  │          │     │
│  │ Dr. Sharma │  │ Dr. Patel  │  │ Dr. Gupta  │  │          │     │
│  │ 45 min     │  │ 1h 12min   │  │ 38 min     │  │          │     │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘     │
│                                                                      │
│  ── Anatomy ────────────────────────────────────────── See All →    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │ [Thumbnail]│  │ [Thumbnail]│  │ [Thumbnail]│  │ [Thumbnail]│  │
│  │ ✅ Watched │  │ ✅ Watched │  │ 🆕 New     │  │ 🆕 New     │  │
│  │ Upper Limb │  │ Lower Limb │  │ Thorax     │  │ Abdomen    │  │
│  │ 1h 20min   │  │ 55 min     │  │ 1h 05min   │  │ 48 min     │  │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘  │
│                                                                      │
│  ── Physiology ─────────────────────────────────────── See All →    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │ ...        │  │ ...        │  │ ...        │  │ ...        │  │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

### 8.3.5 Video Player Screen

```
┌──────────────────────────────────────────────────────────────────────┐
│  ← Back to Library                                                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                                                                │  │
│  │                    [VIDEO PLAYER]                              │  │
│  │                                                                │  │
│  │                                                                │  │
│  │  ▶ ◄◄ ►► ──────────●────────────── 24:35 / 1:05:00          │  │
│  │  🔊 ▓▓▓▓░░  CC  ⚙️ 720p  ⏱ 1.5x  🖼 PiP  ⛶ Fullscreen   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────┐  ┌──────────────────────────┐ │
│  │ Cardiac Anatomy — Chambers &    │  │ 📝 My Notes             │ │
│  │ Great Vessels                    │  │                          │ │
│  │                                  │  │ ⏱ 12:30 — Left atrium  │ │
│  │ Dr. Rajesh Sharma               │  │   receives 4 pulmonary  │ │
│  │ Dept: Anatomy │ MBBS Year 1     │  │   veins                 │ │
│  │ 📅 June 20, 2026 │ 1h 5min     │  │                          │ │
│  │ 👁 234 views │ ⭐ 4.8           │  │ ⏱ 18:45 — Right ventri │ │
│  │                                  │  │   cle is anterior       │ │
│  │ Tags: cardiac, anatomy, heart,  │  │                          │ │
│  │       chambers, vessels          │  │ [+ Add note at 24:35]  │ │
│  │                                  │  │                          │ │
│  │ 🔖 Bookmarks:                   │  │ ── Bookmarks ──         │ │
│  │  ⏱ 05:20 — Intro to chambers   │  │ 🔖 05:20 Intro          │ │
│  │  ⏱ 18:45 — Right ventricle     │  │ 🔖 18:45 RV anatomy     │ │
│  │  ⏱ 35:10 — Great vessels       │  │ 🔖 35:10 Vessels         │ │
│  └──────────────────────────────────┘  └──────────────────────────┘ │
│                                                                      │
│  ── Subtitles / Transcription ────────────────────────────────────   │
│  [24:32] The left ventricle has thicker walls compared to the        │
│  [24:35] right ventricle because it needs to pump blood to the       │
│  [24:38] entire systemic circulation...                              │
│                                                                      │
│  ── Related Videos ────────────────────────────────────────────────  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                    │
│  │ Heart      │  │ ECG        │  │ Coronary   │                    │
│  │ Valves     │  │ Basics     │  │ Arteries   │                    │
│  └────────────┘  └────────────┘  └────────────┘                    │
└──────────────────────────────────────────────────────────────────────┘
```

---

### 8.3.6 Meeting Management Screen

```
┌──────────────────────────────────────────────────────────────────────┐
│  Meetings                                            [+ New Meeting] │
├──────────────────────────────────────────────────────────────────────┤
│  [Upcoming]  [Past]  [Action Items (5)]  [Recurring]                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ── Today ──────────────────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ 🔵 10:00 AM  │ Department Faculty Meeting                     │ │
│  │              │ 📍 Conference Room 2 + 🎥 Virtual              │ │
│  │              │ 👥 12 participants │ 📋 5 agenda items          │ │
│  │              │ [Join Video] [View Agenda] [Start]              │ │
│  ├──────────────┼────────────────────────────────────────────────┤ │
│  │ 🟡 02:00 PM  │ Case Review — Cardiology                       │ │
│  │              │ 📍 Virtual Only                                 │ │
│  │              │ 👥 8 participants │ 📎 2 attachments            │ │
│  │              │ [Join Video] [View Details]                     │ │
│  └──────────────┴────────────────────────────────────────────────┘ │
│                                                                      │
│  ── Tomorrow ──────────────────────────────────────────────────     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ 🔵 09:00 AM  │ Academic Council Meeting                       │ │
│  │              │ 📍 Auditorium                                   │ │
│  │              │ 👥 25 participants │ RSVP: ✅ Accepted          │ │
│  └──────────────┴────────────────────────────────────────────────┘ │
│                                                                      │
│  ── Action Items (Due Soon) ────────────────────────────────────    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ ⚠️ Prepare curriculum report         │ Due: Today   │ ⬜→✅  │ │
│  │ ⬜ Review PG rotation feedback       │ Due: Jun 30  │ ⬜→✅  │ │
│  │ 🔴 Submit equipment requisition      │ OVERDUE      │ ⬜→✅  │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

---

### 8.3.7 Attendance View (Student Self-View)

```
┌──────────────────────────────────────────────────────────────────┐
│  My Attendance                                    📅 June 2026  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Overall Attendance: ██████████░░░ 82%    Target: 75% ✅        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Subject         │ Total │ Present │ Absent │ %     │ Status│ │
│  ├─────────────────┼───────┼─────────┼────────┼───────┼───────┤ │
│  │ Anatomy         │  45   │   40    │   5    │ 89%   │  ✅   │ │
│  │ Physiology      │  42   │   35    │   7    │ 83%   │  ✅   │ │
│  │ Biochemistry    │  38   │   30    │   8    │ 79%   │  ✅   │ │
│  │ Clinical Post.  │  20   │   14    │   6    │ 70%   │  ⚠️   │ │
│  │ Pharmacology    │  35   │   32    │   3    │ 91%   │  ✅   │ │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ⚠️ Clinical Posting attendance is below 75%. 3 more classes    │
│     required to reach minimum threshold.                         │
│                                                                  │
│  ── June Calendar View ──                                        │
│  ┌──┬──┬──┬──┬──┬──┬──┐                                        │
│  │Mo│Tu│We│Th│Fr│Sa│Su│                                        │
│  ├──┼──┼──┼──┼──┼──┼──┤                                        │
│  │🟢│🟢│🔴│🟢│🟢│  │  │   🟢 Present  🔴 Absent               │
│  │🟢│🟡│🟢│🟢│🔴│  │  │   🟡 Late     ⬜ Holiday/No Class     │
│  │🟢│🟢│🟢│🟢│🟢│  │  │                                        │
│  │🟢│🟢│🔴│🟢│🟢│  │  │                                        │
│  └──┴──┴──┴──┴──┴──┴──┘                                        │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.3.8 Offline Assessment — Marks Entry (Faculty)

```
┌──────────────────────────────────────────────────────────────────────┐
│  Record Offline Assessment                                [Save Draft]│
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Assessment: Internal Assessment 1 — Anatomy                        │
│  Type: Written │ Date: June 15, 2026 │ Batch: MBBS 2024            │
│  Max Marks: 100 │ Components: Theory (60) + Practical (20) + Viva(20)│
│                                                                      │
│  ┌────┬──────────────┬───────────┬────────────┬──────┬───────┬─────┐│
│  │ #  │ Student Name  │ Theory/60 │ Practical/20│Viva/20│ Total │Grade││
│  ├────┼──────────────┼───────────┼────────────┼──────┼───────┼─────┤│
│  │ 1  │ Priya Sharma  │ [48]      │ [16]       │ [15] │  79   │ A-  ││
│  │ 2  │ Rahul Patel   │ [35]      │ [12]       │ [10] │  57   │ C+  ││
│  │ 3  │ Anita Verma   │ [52]      │ [18]       │ [17] │  87   │ A   ││
│  │ 4  │ Suresh Kumar  │ [28]      │ [8]        │ [7]  │  43   │ D   ││
│  │ 5  │ ...           │ [  ]      │ [  ]       │ [  ] │       │     ││
│  │ .. │ ...           │ ...       │ ...        │ ...  │ ...   │ ... ││
│  └────┴──────────────┴───────────┴────────────┴──────┴───────┴─────┘│
│                                                                      │
│  Showing 1-20 of 85 students    [← Prev] [Next →]                  │
│                                                                      │
│  [📥 Import from CSV]  [📤 Export Template]                          │
│                                                                      │
│  ┌──────────────┐  ┌──────────────────┐                              │
│  │ Save as Draft │  │ Submit for Review │                             │
│  └──────────────┘  └──────────────────┘                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 8.4 Mobile vs Web Feature Parity

| Feature | Mobile | Web | Notes |
|---------|:------:|:---:|-------|
| Dashboard | ✅ Simplified | ✅ Full | Mobile shows key metrics only |
| Timetable View | ✅ Day/Week | ✅ Day/Week/Month | |
| Attendance (Mark) | ✅ QR Scan | ✅ Manual + QR Display | Faculty displays QR on web, students scan on mobile |
| Attendance (View) | ✅ | ✅ | |
| Video Call | ✅ | ✅ | Full-featured on both |
| Video Library | ✅ | ✅ | Mobile supports offline download |
| Video Upload | ✅ Background | ✅ | |
| Notes (View) | ✅ | ✅ | |
| Notes (Create/Edit) | ✅ Basic | ✅ Full Editor | Mobile has simplified editor |
| Meetings | ✅ | ✅ Full | Mobile: view + join, Web: full management |
| Marks Entry | ❌ | ✅ Grid | Too complex for mobile — web only |
| Admin Panel | ❌ | ✅ | Admin functions are web-only |
| Reports | ✅ View | ✅ View + Export | |
| Push Notifications | ✅ Native | ✅ Browser | |
| Offline Mode | ✅ Cached Data | ❌ | Mobile caches recent data for offline |
| Biometric Login | ✅ | ❌ | |
| QR Scan | ✅ Camera | ❌ | Students scan on mobile |

---

## 8.5 Responsive Breakpoints

| Breakpoint | Device | Layout |
|-----------|--------|--------|
| < 480px | Phone (portrait) | Single column, bottom nav, stacked cards |
| 480-768px | Phone (landscape) / Small tablet | Two-column where appropriate |
| 768-1024px | Tablet | Sidebar collapsible, 2-3 column grid |
| 1024-1440px | Desktop | Full sidebar, 3-4 column grid |
| > 1440px | Large desktop | Max-width container, spacious layout |

---

> [!NOTE]
> Detailed wireframes and high-fidelity mockups will be created during the UI design phase using Figma or similar tool. These ASCII layouts serve as the functional specification for screen structure and content.
