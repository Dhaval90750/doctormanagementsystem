# 02 — User Roles & Access Control

> **Document Version:** 1.0.0-DRAFT  
> **Last Updated:** 2026-06-27  
> **Status:** 🟡 Draft

---

## 2.1 Overview

The DSMS uses a **Role-Based Access Control (RBAC)** model with the following principles:

1. **Predefined Roles** — System ships with sensible default roles and permissions
2. **Editable Permissions** — Super Admin can modify permissions for any role
3. **Custom Roles** — Super Admin can create entirely new roles
4. **Hierarchical** — Higher roles inherit base permissions of lower roles (configurable)
5. **Module-Level + Action-Level** — Permissions are defined per module AND per action (view, create, edit, delete, approve, export)
6. **Context-Aware** — Some permissions are scoped (e.g., "can edit only own department's data")

---

## 2.2 Predefined Roles

### Role Hierarchy

```
Super Admin
  └── Institution Admin
        ├── HOD (Head of Department)
        │     ├── Senior Doctor / Professor
        │     │     ├── Junior Doctor / Resident (PG Student)
        │     │     └── Teaching Assistant
        │     └── Doctor (Non-Teaching / Visiting)
        ├── Examination Cell
        ├── Administrative Staff
        └── Student (UG)
              └── Student (Intern)
```

### Role Definitions

| Role ID | Role Name | Description | Scope |
|---------|-----------|-------------|-------|
| `SUPER_ADMIN` | Super Admin | Full system access. System-level configuration, multi-institution support (future). | Global |
| `INSTITUTION_ADMIN` | Institution Admin | Manages institution-wide settings, users, departments, reports. | Institution |
| `HOD` | Head of Department | Manages department — faculty allocation, curriculum, approvals. | Department |
| `SENIOR_DOCTOR` | Senior Doctor / Professor | Creates teaching sessions, evaluates students, manages clinical postings. | Department / Unit |
| `JUNIOR_DOCTOR` | Junior Doctor / Resident | PG student — attends rotations, submits case logs, takes assigned duties. | Department / Unit |
| `TEACHING_ASSISTANT` | Teaching Assistant | Assists in teaching, takes attendance, manages lab/tutorial sessions. | Department / Unit |
| `VISITING_DOCTOR` | Visiting / Guest Doctor | Limited access — participates in specific sessions, guest lectures. | Session-specific |
| `EXAM_CELL` | Examination Cell | Manages exams, results, hall tickets, external examiner coordination. | Institution (Exam scope) |
| `ADMIN_STAFF` | Administrative Staff | Data entry, scheduling, report generation, facility booking. | Institution / Department |
| `STUDENT_UG` | Undergraduate Student | Attends lectures, views timetable, submits assignments, checks results. | Department / Batch |
| `STUDENT_INTERN` | Intern | Clinical rotations, duty logging, case presentations. | Department / Unit |
| `PARENT_GUARDIAN` | Parent / Guardian | View-only access to ward's attendance, grades, and announcements. | Student-specific |

---

## 2.3 Permission Matrix

### Permission Actions

Each module supports these granular actions:

| Action Code | Action | Description |
|-------------|--------|-------------|
| `VIEW` | View / Read | Can see data |
| `CREATE` | Create / Add | Can create new records |
| `EDIT` | Edit / Update | Can modify existing records |
| `DELETE` | Delete / Remove | Can delete records |
| `APPROVE` | Approve / Reject | Can approve or reject requests |
| `EXPORT` | Export / Download | Can export data (PDF, Excel, CSV) |
| `MANAGE` | Manage / Configure | Can configure module settings |
| `ASSIGN` | Assign / Allocate | Can assign resources, tasks, duties |

### Module-Role Permission Matrix

> ✅ = Full | 👁️ = View Only | 🔒 = Own Data Only | ❌ = No Access | ⚙️ = Configurable

#### Core Modules

| Module | Super Admin | Inst. Admin | HOD | Sr. Doctor | Jr. Doctor | Student UG | Admin Staff | Exam Cell |
|--------|:-----------:|:-----------:|:---:|:----------:|:----------:|:----------:|:-----------:|:---------:|
| **User Management** | ✅ | ✅ | 👁️ (dept) | ❌ | ❌ | ❌ | 👁️ | ❌ |
| **Role & Permission Mgmt** | ✅ | 👁️ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Department Management** | ✅ | ✅ | 🔒 | 👁️ | 👁️ | 👁️ | 👁️ | ❌ |
| **Student Profiles** | ✅ | ✅ | ✅ (dept) | 👁️ (unit) | 🔒 | 🔒 | ✅ | 👁️ |
| **Faculty Profiles** | ✅ | ✅ | ✅ (dept) | 🔒 | 👁️ | 👁️ | 👁️ | ❌ |

#### Academic Modules

| Module | Super Admin | Inst. Admin | HOD | Sr. Doctor | Jr. Doctor | Student UG | Admin Staff | Exam Cell |
|--------|:-----------:|:-----------:|:---:|:----------:|:----------:|:----------:|:-----------:|:---------:|
| **Curriculum / Syllabus** | ✅ | ✅ | ✅ | 👁️ | 👁️ | 👁️ | 👁️ | ❌ |
| **Timetable / Schedule** | ✅ | ✅ | ✅ | 👁️+Create | 👁️ | 👁️ | ✅ | ❌ |
| **Attendance** | ✅ | ✅ | ✅ (dept) | ✅ (session) | 🔒 | 🔒 (view) | ✅ | ❌ |
| **Assignments** | ✅ | 👁️ | ✅ (dept) | ✅ | 🔒 (submit) | 🔒 (submit) | ❌ | ❌ |
| **Exams & Results** | ✅ | ✅ | ✅ (dept) | ✅ (eval) | 🔒 (view) | 🔒 (view) | 👁️ | ✅ |
| **Clinical Rotations** | ✅ | ✅ | ✅ | ✅ (assign) | 🔒 (view) | 🔒 (view) | 👁️ | ❌ |
| **Case Logs / Logbook** | ✅ | 👁️ | ✅ (dept) | ✅ (review) | 🔒 (CRUD) | ❌ | ❌ | ❌ |

#### Collaboration Modules

| Module | Super Admin | Inst. Admin | HOD | Sr. Doctor | Jr. Doctor | Student UG | Admin Staff | Exam Cell |
|--------|:-----------:|:-----------:|:---:|:----------:|:----------:|:----------:|:-----------:|:---------:|
| **Meetings** | ✅ | ✅ | ✅ | ✅ | ⚙️ | ⚙️ | ✅ | ⚙️ |
| **Notes / Documents** | ✅ | ✅ | ✅ | ✅ | 🔒+shared | 🔒+shared | 👁️ | ❌ |
| **Announcements** | ✅ | ✅ | ✅ (dept) | ⚙️ | 👁️ | 👁️ | ⚙️ | ✅ (exam) |
| **Notifications** | ✅ | ✅ | 👁️ | 👁️ | 👁️ | 👁️ | 👁️ | 👁️ |
| **Messaging** | ✅ | ✅ | ✅ | ✅ | ⚙️ | ⚙️ | ✅ | ⚙️ |

#### Administrative Modules

| Module | Super Admin | Inst. Admin | HOD | Sr. Doctor | Jr. Doctor | Student UG | Admin Staff | Exam Cell |
|--------|:-----------:|:-----------:|:---:|:----------:|:----------:|:----------:|:-----------:|:---------:|
| **Place/Facility Mgmt** | ✅ | ✅ | 👁️+Book | 👁️+Book | 👁️+Req | ❌ | ✅ | 👁️+Book |
| **Reports & Analytics** | ✅ | ✅ | ✅ (dept) | 👁️ (unit) | ❌ | ❌ | ✅ (generate) | ✅ (exam) |
| **Audit Logs** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **System Configuration** | ✅ | ⚙️ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 2.4 Permission Scoping

Permissions are not just YES/NO — they have **scope modifiers**:

### Scope Levels

```
GLOBAL          → Can access across all institutions (Super Admin only)
INSTITUTION     → Can access all data within their institution
DEPARTMENT      → Can access only their department's data
UNIT            → Can access only their unit/division's data
BATCH           → Can access only their batch/year data
SELF            → Can access only their own data
SESSION         → Can access only data for sessions they are part of
```

### Scope Examples

| Role | Module | Permission | Scope |
|------|--------|-----------|-------|
| HOD | Student Profiles | VIEW, EDIT | DEPARTMENT |
| Senior Doctor | Attendance | CREATE, EDIT | SESSION (only sessions they conduct) |
| Junior Doctor | Case Logs | CREATE, VIEW, EDIT, DELETE | SELF |
| Student UG | Results | VIEW | SELF |
| Admin Staff | Timetable | CREATE, EDIT, VIEW | DEPARTMENT (assigned) |
| Exam Cell | Results | CREATE, EDIT, APPROVE, EXPORT | INSTITUTION (exam scope) |

---

## 2.5 Permission Configuration System

### Data Model for RBAC

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│      Roles       │     │   Permissions    │     │    Modules       │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│ id               │     │ id               │     │ id               │
│ name             │     │ role_id (FK)     │     │ name             │
│ display_name     │     │ module_id (FK)   │     │ code             │
│ description      │     │ action           │     │ description      │
│ is_system_role   │     │ scope_level      │     │ is_active        │
│ hierarchy_level  │     │ is_granted       │     │ parent_module_id │
│ is_active        │     │ conditions (JSON)│     └──────────────────┘
│ created_by       │     │ created_by       │
│ institution_id   │     └──────────────────┘
└──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│  User_Roles      │     │  Permission_     │
│  (Junction)      │     │  Overrides       │
├──────────────────┤     ├──────────────────┤
│ user_id (FK)     │     │ user_id (FK)     │
│ role_id (FK)     │     │ permission_id(FK)│
│ scope_entity_id  │     │ is_granted       │
│ scope_entity_type│     │ reason           │
│ assigned_by      │     │ granted_by       │
│ valid_from       │     │ valid_from       │
│ valid_until      │     │ valid_until      │
└──────────────────┘     └──────────────────┘
```

### Key Features

1. **System Roles** (`is_system_role = true`) — Cannot be deleted, only modified
2. **Custom Roles** — Admin can clone a system role and customize it
3. **Permission Overrides** — Grant or revoke specific permissions for individual users (overrides role defaults)
4. **Temporal Permissions** — Permissions can have `valid_from` and `valid_until` dates (e.g., visiting doctor access for 1 week)
5. **Conditional Permissions** — JSON conditions for complex rules (e.g., "can approve leave only if < 3 days")
6. **Multi-Role Support** — A user can have multiple roles (e.g., a PG student who is also a Teaching Assistant)

---

## 2.6 Permission Resolution Logic

When checking if a user can perform an action:

```
1. Get all roles assigned to the user (active, within valid dates)
2. For each role, get all permissions for the requested module + action
3. Check if any permission_override exists for this user
4. Apply scope filtering:
   a. If scope = SELF → filter to user's own records
   b. If scope = DEPARTMENT → filter to user's department
   c. If scope = SESSION → filter to user's sessions
   d. etc.
5. GRANT wins if any role grants the permission (union model)
6. Explicit DENY in override always wins (deny trumps grant)
7. If no matching permission found → DENY by default
```

---

## 2.7 Default Role Templates

When the system is first set up, these role templates are auto-created. The admin can then customize them.

### Super Admin (Cannot be modified)
- Full access to everything
- Can create/manage institutions
- Can create/manage all users and roles
- Can view audit logs
- System configuration access

### Institution Admin
- Full access within their institution
- Cannot modify system-level settings
- Can create custom roles
- Can view institution-wide reports

### HOD
- Full access within their department
- Can approve/reject leave, duty changes
- Can assign faculty to sessions
- Can view department reports and analytics
- Can manage department curriculum

### Senior Doctor / Professor
- Can create and manage teaching sessions they own
- Can take/edit attendance for their sessions
- Can create assignments and evaluate submissions
- Can review junior doctor case logs
- Can create and share notes
- Can schedule meetings within their scope

### Junior Doctor / Resident
- Can view their rotation schedule and duties
- Can submit and manage their own case logs
- Can view and submit assignments
- Can view their attendance and results
- Can create personal notes and view shared notes
- Can participate in meetings

### Student (UG)
- Can view timetable and schedule
- Can view their own attendance
- Can submit assignments
- Can view their results
- Can view shared notes and announcements
- Read-only access to most modules

---

## 2.8 Admin UI for Permission Management

The permission management screen SHALL provide:

1. **Role List View** — Table of all roles with hierarchy indicator
2. **Permission Grid** — Matrix view (modules × actions) for a selected role with checkboxes
3. **Clone Role** — One-click to clone an existing role and customize
4. **Compare Roles** — Side-by-side comparison of two roles' permissions
5. **User Override** — Search user → view effective permissions → add/remove overrides
6. **Audit Trail** — Log of all permission changes with who/when/what

> [!IMPORTANT]
> System roles (SUPER_ADMIN, etc.) cannot be deleted but CAN have their permissions modified by Super Admin. This ensures the system is flexible while preventing accidental lockouts.

> [!WARNING]
> If Super Admin removes their own access to Role Management, there should be a **recovery mechanism** (e.g., database-level script or environment variable override).
