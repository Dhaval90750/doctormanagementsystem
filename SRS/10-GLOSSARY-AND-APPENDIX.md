# 10 — Glossary & Appendix

> **Document Version:** 1.0.0-DRAFT  
> **Last Updated:** 2026-06-27  
> **Status:** 🟡 Draft

---

## 10.1 Glossary

### Medical Education Terms

| Term | Definition |
|------|-----------|
| **UG** | Undergraduate — MBBS, BDS students |
| **PG** | Postgraduate — MD, MS, Diploma students |
| **Super-Specialty** | DM, MCh — advanced specialization after PG |
| **DNB** | Diplomate of National Board — PG equivalent |
| **MBBS** | Bachelor of Medicine and Bachelor of Surgery |
| **BDS** | Bachelor of Dental Surgery |
| **MD** | Doctor of Medicine (PG) |
| **MS** | Master of Surgery (PG) |
| **DM** | Doctorate of Medicine (Super-Specialty) |
| **MCh** | Master of Chirurgiae (Super-Specialty, Surgery) |
| **Intern** | Graduate doctor completing compulsory rotating internship |
| **Resident** | PG student working in a department as part of training |
| **HOD** | Head of Department |
| **Clinical Posting** | Period where students work in clinical departments (wards, OPDs) |
| **Rotation** | Scheduled rotation of PG students through different departments/units |
| **Grand Round** | A formal teaching session where a case is presented to a large audience |
| **Journal Club** | Session where latest research papers are discussed |
| **Case Discussion** | Educational session discussing a specific clinical case |
| **OSCE** | Objective Structured Clinical Examination |
| **Mini-CEX** | Mini-Clinical Evaluation Exercise — direct observation assessment |
| **DOPS** | Direct Observation of Procedural Skills |
| **CBD** | Case-Based Discussion — structured assessment tool |
| **EPA** | Entrustable Professional Activities — competency framework |
| **Case Log** | Record of clinical cases seen/managed by a student |
| **Logbook** | Formal record of procedures, cases, and skills during training |
| **OPD** | Out-Patient Department |
| **OT** | Operation Theatre |
| **ICU** | Intensive Care Unit |
| **Ward** | Hospital ward — in-patient section |
| **Skill Lab** | Laboratory for practicing clinical skills on simulators |
| **Simulation Center** | Facility with advanced simulation equipment for training |

### Technical Terms

| Term | Definition |
|------|-----------|
| **RBAC** | Role-Based Access Control — permission model based on assigned roles |
| **JWT** | JSON Web Token — standard for secure token-based authentication |
| **WebRTC** | Web Real-Time Communication — browser-native video/audio protocol |
| **SFU** | Selective Forwarding Unit — media server that forwards video streams selectively |
| **MCU** | Multipoint Control Unit — media server that mixes all streams (not used) |
| **TURN** | Traversal Using Relays around NAT — relay server for WebRTC behind firewalls |
| **STUN** | Session Traversal Utilities for NAT — helps discover public IP for WebRTC |
| **HLS** | HTTP Live Streaming — Apple's adaptive streaming protocol |
| **DASH** | Dynamic Adaptive Streaming over HTTP — streaming protocol |
| **VOD** | Video on Demand — pre-recorded video streaming |
| **CDN** | Content Delivery Network — distributed network for fast content delivery |
| **SSR** | Server-Side Rendering — rendering pages on the server |
| **SPA** | Single Page Application — client-side rendered web app |
| **CRDT** | Conflict-free Replicated Data Type — for collaborative editing |
| **ORM** | Object-Relational Mapping — database abstraction layer |
| **DTO** | Data Transfer Object — object for API request/response |
| **STT** | Speech-to-Text — converting audio to written text |
| **TTS** | Text-to-Speech — converting written text to audio |
| **CORS** | Cross-Origin Resource Sharing — browser security mechanism |
| **CSP** | Content Security Policy — browser security header |
| **CSRF** | Cross-Site Request Forgery — web security vulnerability |
| **XSS** | Cross-Site Scripting — web security vulnerability |
| **ICS** | iCalendar format — standard calendar event file |
| **RRULE** | Recurrence Rule — standard for defining recurring events |
| **tus** | Resumable upload protocol — for reliable large file uploads |
| **DRM** | Digital Rights Management — content protection for videos |

---

## 10.2 Abbreviations Used in Documents

| Abbreviation | Full Form |
|-------------|-----------|
| DSMS | Doctor Student Management System |
| FR | Functional Requirement |
| NFR | Non-Functional Requirement |
| UC | Use Case |
| MOD | Module |
| API | Application Programming Interface |
| UI | User Interface |
| UX | User Experience |
| DB | Database |
| SRS | Software Requirements Specification |
| CRUD | Create, Read, Update, Delete |
| RSVP | Répondez S'il Vous Plaît (respond please) |
| P0/P1/P2/P3 | Priority levels (0 = highest) |
| PII | Personally Identifiable Information |
| RTO | Recovery Time Objective |
| RPO | Recovery Point Objective |
| CI/CD | Continuous Integration / Continuous Deployment |
| QR | Quick Response (code) |

---

## 10.3 Requirement Priority Matrix

| Priority | Label | Phase | Description |
|----------|-------|-------|-------------|
| **P0** | Must Have | Phase 1 | Core functionality. System cannot launch without these features. Blocking. |
| **P1** | Should Have | Phase 1-2 | Important for good UX. Should be in first release but can slip to early Phase 2. |
| **P2** | Nice to Have | Phase 2 | Significantly enhances the system but not required for launch. |
| **P3** | Future | Phase 3+ | Planned for future releases. Included in SRS for completeness. |

---

## 10.4 Assumption Register

| ID | Assumption | Impact if Wrong | Mitigation |
|----|-----------|----------------|------------|
| A1 | Institutions have stable internet | Video features won't work | Offline mode on mobile, graceful degradation |
| A2 | Users have modern smartphones (Android 8+ / iOS 15+) | Mobile app won't install | Progressive web app as fallback |
| A3 | PostgreSQL schema-per-tenant is sufficient for 50+ colleges | Performance degradation | Migration path to database-per-tenant |
| A4 | Self-hosted Whisper provides acceptable transcription quality | Poor transcription | Cloud STT API as fallback option |
| A5 | mediasoup handles 50 participants per room | Video quality issues at scale | Webinar mode with fewer active feeds |
| A6 | coturn TURN server handles concurrent NAT traversal | Connection failures | Multiple TURN servers, geographic distribution |
| A7 | HLS streaming provides acceptable latency for VOD | Buffering complaints | CDN optimization, pre-loading |
| A8 | Users are primarily English-speaking | Localization needed sooner | i18n-ready architecture from day 1 |

---

## 10.5 Risk Register

| ID | Risk | Probability | Impact | Mitigation |
|----|------|:-----------:|:------:|------------|
| R1 | WebRTC complexity causes delays | High | High | Start with 1-on-1 calls, scale to groups incrementally |
| R2 | Video storage costs escalate rapidly | Medium | High | Implement storage quotas, video expiry policies, compression |
| R3 | Transcription accuracy is poor for medical terms | High | Medium | Custom vocabulary training, manual correction option |
| R4 | Multi-tenancy adds complexity to every query | Medium | High | Thorough testing, Hibernate filters for auto-scoping |
| R5 | Mobile WebRTC performance on low-end devices | Medium | Medium | Graceful degradation, audio-only fallback |
| R6 | Large file uploads fail on unstable networks | Medium | Medium | Resumable uploads (tus), chunked upload support |
| R7 | Real-time features (WebSocket) don't scale | Low | High | Redis pub/sub for horizontal scaling, Socket.io adapter |
| R8 | Permission system becomes too complex | Medium | Medium | Clear UI for permission management, role templates |

---

## 10.6 Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0-DRAFT | 2026-06-27 | System Architect (AI) + User | Initial SRS creation covering all 18 modules |

---

## 10.7 References

| # | Reference | URL/Location |
|---|-----------|-------------|
| 1 | WebRTC Documentation | https://webrtc.org/ |
| 2 | mediasoup Documentation | https://mediasoup.org/documentation/ |
| 3 | Spring Boot Reference | https://docs.spring.io/spring-boot/docs/current/reference/ |
| 4 | Next.js Documentation | https://nextjs.org/docs |
| 5 | PostgreSQL Multi-Tenancy | https://www.postgresql.org/docs/current/ddl-schemas.html |
| 6 | OpenAI Whisper | https://github.com/openai/whisper |
| 7 | HLS Specification | https://datatracker.ietf.org/doc/html/rfc8216 |
| 8 | coturn TURN Server | https://github.com/coturn/coturn |
| 9 | tus Resumable Upload | https://tus.io/ |
| 10 | OWASP Top 10 | https://owasp.org/www-project-top-ten/ |

---

## 10.8 Contact & Ownership

| Role | Owner | Notes |
|------|-------|-------|
| Product Owner | User | Final decision authority on features and priorities |
| System Architect | AI (Antigravity) + User | Technical design, architecture decisions |
| Full Stack Development | User + AI | Implementation |
| Code Review | Collaborative | Both review each other's work |

---

> [!TIP]
> This SRS is a **living document**. As we build the system together, we'll refine requirements, add detail to modules we're actively implementing, and mark completed items. Use the priority system (P0-P3) to decide what to build first.
