# 📋 Doctor Student Management System (DSMS) — Software Requirements Specification

> **Project Name:** Doctor Student Management System (DSMS)  
> **Version:** 1.0.0-DRAFT  
> **Date:** 2026-06-27  
> **Authors:** User + Antigravity (AI)  
> **Status:** 🟡 Draft — Awaiting Review  

---

## Document Structure

This SRS is organized into the following documents for clarity and maintainability:

| # | Document | Description |
|---|----------|-------------|
| 01 | [Introduction & Vision](file:///e:/Personal/Doctor%20Management%20System/SRS/01-INTRODUCTION.md) | Project overview, goals, scope, stakeholders, and constraints |
| 02 | [User Roles & Access Control](file:///e:/Personal/Doctor%20Management%20System/SRS/02-USER-ROLES-AND-ACCESS-CONTROL.md) | 12 predefined roles, permission matrix, RBAC with editable permissions |
| 03 | [Functional Requirements](file:///e:/Personal/Doctor%20Management%20System/SRS/03-FUNCTIONAL-REQUIREMENTS.md) | 18 modules, 40+ feature groups with prioritized requirements |
| 04 | [Module Specifications](file:///e:/Personal/Doctor%20Management%20System/SRS/04-MODULE-SPECIFICATIONS.md) | Detailed use case flows for meetings, video, attendance, assessments |
| 05 | [Non-Functional Requirements](file:///e:/Personal/Doctor%20Management%20System/SRS/05-NON-FUNCTIONAL-REQUIREMENTS.md) | Performance, security, scalability, video/media requirements |
| 06 | [Data Model & Database Design](file:///e:/Personal/Doctor%20Management%20System/SRS/06-DATA-MODEL.md) | SQL schema, ER relationships, multi-tenant strategy |
| 07 | [API Specification](file:///e:/Personal/Doctor%20Management%20System/SRS/07-API-SPECIFICATION.md) | REST endpoints, WebSocket events, auth flows |
| 08 | [UI/UX Wireframes & Flows](file:///e:/Personal/Doctor%20Management%20System/SRS/08-UI-UX-FLOWS.md) | Screen layouts (web + mobile), navigation, role-specific dashboards |
| 09 | [Technology Stack & Architecture](file:///e:/Personal/Doctor%20Management%20System/SRS/09-TECH-STACK-AND-ARCHITECTURE.md) | Spring Boot + Next.js + Kotlin, WebRTC video, deployment architecture |
| 10 | [Glossary & Appendix](file:///e:/Personal/Doctor%20Management%20System/SRS/10-GLOSSARY-AND-APPENDIX.md) | Medical & technical terms, risks, assumptions, references |

---

## Key System Highlights

| Feature | Details |
|---------|---------|
| **18 Modules** | Auth, Users, Departments, Students, Faculty, Teaching, Assessments, Attendance, Meetings, Notes, Facilities, Communication, Reports, Config, Audit, **Video Conferencing**, **Video Learning**, **Multi-College** |
| **Built-in Video Conferencing** | WebRTC-based, no Zoom/Meet dependency — screen share, live transcription, recording, collaborative notes |
| **Video Learning Platform** | Upload, transcode, stream pre-recorded lectures — progress tracking, playlists, adaptive bitrate |
| **Multi-College Support** | Multiple institutions, data isolation, cross-college reporting, college-level admin portals |
| **Offline Assessment Tracking** | Record physical exam results, bulk marks entry, consolidated mark sheets |
| **All Program Levels** | UG (MBBS/BDS), PG (MD/MS), Super-Specialty (DM/MCh), DNB, Diploma, Fellowship |
| **Web + Mobile** | Next.js web app + Kotlin Android (native) — with mobile-first design |
| **RBAC** | 12 predefined roles, editable permissions, scope-based access, temporal permissions |

---

## How to Navigate

- Start with **01-INTRODUCTION** for the big picture
- Jump to **02-USER-ROLES** for access control design
- Dive into **03-FUNCTIONAL-REQUIREMENTS** and **04-MODULE-SPECIFICATIONS** for detailed features
- Review **06-DATA-MODEL** and **07-API-SPECIFICATION** for technical design
- Check **09-TECH-STACK** for architecture and project structure

## Review Process

1. 🟡 **Draft** — Initial creation (current)
2. 🔵 **Under Review** — Stakeholder review in progress
3. 🟢 **Approved** — Ready for implementation
4. 🔴 **Needs Revision** — Changes requested

---

> [!IMPORTANT]
> This is a living document. Each section will be refined based on your feedback. Please review each document and flag anything that needs modification, addition, or removal.
