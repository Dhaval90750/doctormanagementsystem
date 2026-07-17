# 09 — Technology Stack & Architecture

> **Document Version:** 1.0.0-DRAFT  
> **Last Updated:** 2026-06-27  
> **Status:** 🟡 Draft

---

## 9.1 Technology Stack

### Backend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Language** | Java 21 (LTS) | Primary backend language |
| **Framework** | Spring Boot 3.x | REST API, dependency injection, security |
| **Security** | Spring Security + JWT | Authentication & authorization |
| **ORM** | Spring Data JPA + Hibernate | Database access |
| **Database** | PostgreSQL 16 | Primary relational database |
| **Caching** | Redis 7 | Session store, caching, pub/sub |
| **Search** | PostgreSQL FTS (→ Elasticsearch later) | Full-text search |
| **Message Queue** | RabbitMQ or Redis Streams | Async tasks (transcoding, notifications) |
| **File Storage** | MinIO (self-hosted) / AWS S3 | Documents, images, video files |
| **API Documentation** | SpringDoc OpenAPI (Swagger) | API docs auto-generation |
| **Migration** | Flyway | Database version control |
| **Build** | Gradle | Build and dependency management |

### Frontend (Web)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14+ (App Router) | React-based SSR/CSR web app |
| **Language** | TypeScript | Type-safe frontend code |
| **State** | Zustand or Redux Toolkit | Global state management |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS + component library |
| **Forms** | React Hook Form + Zod | Form handling + validation |
| **Data Fetching** | TanStack Query (React Query) | API caching & data management |
| **Rich Text** | TipTap or Plate.js | Notes editor, meeting minutes |
| **Video Player** | Video.js + hls.js | Video playback with HLS |
| **WebRTC** | Native WebRTC API + mediasoup client | Video conferencing |
| **Real-Time** | Socket.io client | WebSocket for notifications, live features |
| **Charts** | Recharts or Chart.js | Dashboards & reports |
| **Tables** | TanStack Table | Data grids (marks entry, reports) |
| **Calendar** | FullCalendar | Timetable, scheduling |

### Mobile

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Kotlin (Android) / Swift (iOS) OR Flutter | Native or cross-platform mobile |
| **Networking** | Retrofit (Kotlin) / Alamofire (Swift) | API communication |
| **Local DB** | Room (Android) / Core Data (iOS) | Offline data caching |
| **WebRTC** | Google WebRTC SDK | Video conferencing |
| **Video Player** | ExoPlayer (Android) / AVPlayer (iOS) | Video playback |
| **Push** | Firebase Cloud Messaging (FCM) / APNs | Push notifications |
| **QR Scanner** | ML Kit / ZXing | Attendance QR scanning |
| **Biometric** | BiometricPrompt (Android) / LocalAuth (iOS) | Biometric login |

### Video Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **SFU (Media Server)** | mediasoup or Janus | Selective Forwarding Unit for group calls |
| **Signaling Server** | Node.js + Socket.io | WebRTC signaling (offer/answer/ICE) |
| **TURN/STUN Server** | coturn | NAT traversal for WebRTC |
| **Recording** | mediasoup recording or ffmpeg | Server-side session recording |
| **Transcoding** | FFmpeg | Video transcoding (uploaded + recorded) |
| **Streaming** | Nginx + nginx-rtmp-module or MediaMTX | HLS/DASH streaming server |
| **Transcription** | Whisper (OpenAI) self-hosted or cloud STT | Speech-to-text |
| **CDN** | CloudFront / Cloudflare | Video delivery, static assets |

### DevOps & Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker + Docker Compose | Application containers |
| **Orchestration** | Kubernetes (production) | Container orchestration |
| **CI/CD** | GitHub Actions | Automated build, test, deploy |
| **Reverse Proxy** | Nginx / Traefik | Load balancing, SSL termination |
| **Monitoring** | Prometheus + Grafana | Metrics, alerting |
| **Logging** | ELK Stack (Elasticsearch, Logstash, Kibana) | Centralized logging |
| **SSL** | Let's Encrypt / Certbot | TLS certificates |

---

## 9.2 System Architecture

### High-Level Architecture

```
                        ┌─────────────────────┐
                        │    CDN (CloudFront)  │
                        │  Static + Video      │
                        └──────────┬──────────┘
                                   │
     ┌─────────────────────────────┼────────────────────────────┐
     │                             │                            │
┌────▼────┐  ┌────────────┐  ┌────▼────┐  ┌─────────────┐    │
│ Web App │  │ Mobile App │  │ Admin   │  │ College     │    │
│(Next.js)│  │(Kotlin/    │  │ Panel   │  │ Portal      │    │
│         │  │ Swift)     │  │ (Web)   │  │ (Web)       │    │
└────┬────┘  └─────┬──────┘  └────┬────┘  └──────┬──────┘    │
     │             │              │               │            │
     └─────────────┴──────────────┴───────────────┘            │
                           │                                    │
                ┌──────────▼──────────┐                        │
                │   Load Balancer     │                        │
                │   (Nginx/Traefik)   │                        │
                └──────────┬──────────┘                        │
                           │                                    │
          ┌────────────────┼────────────────┐                  │
          │                │                │                   │
┌─────────▼────┐  ┌───────▼───────┐  ┌────▼──────────┐       │
│  API Server  │  │  API Server   │  │  API Server   │       │
│  Instance 1  │  │  Instance 2   │  │  Instance N   │       │
│ (Spring Boot)│  │ (Spring Boot) │  │ (Spring Boot) │       │
└──────┬───────┘  └───────┬───────┘  └───────┬────────┘       │
       │                  │                   │                │
       └──────────────────┼───────────────────┘                │
                          │                                    │
    ┌─────────────────────┼─────────────────────┐              │
    │                     │                     │              │
┌───▼────┐  ┌─────────────▼──────┐  ┌──────────▼───┐         │
│PostgreSQL│ │      Redis         │  │  RabbitMQ    │         │
│(Primary +│ │  (Cache + PubSub)  │  │  (Task Queue)│         │
│ Replica) │ │                    │  │              │         │
└──────────┘ └────────────────────┘  └──────────────┘         │
                                                               │
          SEPARATE VIDEO INFRASTRUCTURE                        │
    ┌──────────────────────────────────────┐                   │
    │  ┌────────────┐  ┌──────────────┐   │                   │
    │  │ Signaling  │  │  mediasoup   │   │                   │
    │  │  Server    │  │  SFU Server  │   │                   │
    │  │ (Node.js)  │  │  (Media)     │   │                   │
    │  └──────┬─────┘  └──────┬───────┘   │                   │
    │         │               │           │                   │
    │  ┌──────▼───────────────▼──────┐    │                   │
    │  │      coturn (TURN/STUN)     │    │                   │
    │  └─────────────────────────────┘    │                   │
    │                                      │                   │
    │  ┌────────────┐  ┌──────────────┐   │                   │
    │  │  FFmpeg     │  │  Whisper     │   │                   │
    │  │ Transcoder  │  │ Transcription│   │                   │
    │  │  Workers    │  │  Service     │   │                   │
    │  └────────────┘  └──────────────┘   │                   │
    │                                      │                   │
    │  ┌────────────────────────────────┐  │                   │
    │  │  MinIO / S3 (Video Storage)   │  │                   │
    │  └────────────────────────────────┘  │                   │
    └──────────────────────────────────────┘                   │
```

---

## 9.3 Multi-Tenancy Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│                                                         │
│  Request → Extract tenant from JWT → Set DB Schema      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  TenantContext (ThreadLocal)                     │   │
│  │  ┌─────────────┐                                │   │
│  │  │ college_id  │ → Used to set PostgreSQL       │   │
│  │  │ schema_name │   search_path per request      │   │
│  │  └─────────────┘                                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    Database Layer                        │
│                                                         │
│  PostgreSQL Instance                                    │
│  ├── Schema: platform         (shared tables)           │
│  │   ├── colleges                                       │
│  │   ├── platform_admins                                │
│  │   └── platform_settings                              │
│  │                                                      │
│  ├── Schema: college_abc      (College ABC data)        │
│  │   ├── users                                          │
│  │   ├── departments                                    │
│  │   ├── students                                       │
│  │   └── ... (all module tables)                        │
│  │                                                      │
│  ├── Schema: college_xyz      (College XYZ data)        │
│  │   ├── users                                          │
│  │   ├── departments                                    │
│  │   └── ... (same structure, different data)           │
│  │                                                      │
│  └── Schema: college_def      (College DEF data)        │
│      └── ...                                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 9.4 Video Conferencing Architecture (WebRTC + SFU)

```
┌────────────────────────────────────────────────────────────────┐
│                  Video Call Flow (SFU Model)                    │
│                                                                │
│  Participant A        mediasoup SFU        Participant B       │
│  (Publisher)           Server              (Subscriber)        │
│                                                                │
│  ┌──────────┐    ┌──────────────────┐    ┌──────────┐        │
│  │ Camera   │    │                  │    │          │        │
│  │ + Mic    │───>│  Receives all    │───>│  Receives│        │
│  │          │    │  publisher       │    │  selected│        │
│  │ Produces │    │  streams.        │    │  streams │        │
│  │ stream   │    │                  │    │          │        │
│  └──────────┘    │  Forwards        │    └──────────┘        │
│                  │  selectively     │                         │
│  Participant C   │  based on:       │    Participant D       │
│  ┌──────────┐    │  - Active speaker│    ┌──────────┐        │
│  │ Camera   │───>│  - Layout        │───>│ Receives │        │
│  │ + Mic    │    │  - Bandwidth     │    │ streams  │        │
│  └──────────┘    │                  │    └──────────┘        │
│                  │  Also handles:   │                         │
│                  │  - Simulcast     │                         │
│                  │  - Recording     │                         │
│                  │  - Transcription │                         │
│                  └──────────────────┘                         │
│                                                                │
│  WHY SFU (not Mesh or MCU)?                                   │
│  ✅ Scales to 50+ participants                                │
│  ✅ Lower server CPU than MCU (no transcoding in real-time)   │
│  ✅ Better quality than mesh (each client sends 1 stream)     │
│  ✅ Supports simulcast (multiple quality levels per publisher) │
└────────────────────────────────────────────────────────────────┘
```

---

## 9.5 Video Streaming Architecture (VOD)

```
┌────────────────────────────────────────────────────────────┐
│                   Video Upload & Streaming Pipeline        │
│                                                            │
│  Faculty                                                   │
│  ┌──────────┐                                             │
│  │ Uploads  │                                             │
│  │ video    │─── Resumable Upload (tus protocol) ──┐     │
│  └──────────┘                                      │     │
│                                                     │     │
│                                              ┌──────▼─────┐│
│                                              │  API Server ││
│                                              │             ││
│                                              │ Stores raw  ││
│                                              │ file to S3  ││
│                                              └──────┬──────┘│
│                                                     │      │
│                                              Publishes job  │
│                                              to queue       │
│                                                     │      │
│                                              ┌──────▼──────┐│
│                                              │  FFmpeg     ││
│                                              │  Worker     ││
│                                              │             ││
│                                              │ Transcodes: ││
│                                              │ • 360p      ││
│                                              │ • 480p      ││
│                                              │ • 720p      ││
│                                              │ • 1080p     ││
│                                              │             ││
│                                              │ Generates:  ││
│                                              │ • HLS segs  ││
│                                              │ • Manifest  ││
│                                              │ • Thumbnail ││
│                                              └──────┬──────┘│
│                                                     │      │
│                                              ┌──────▼──────┐│
│                                              │  Whisper    ││
│                                              │ Transcribe  ││
│                                              │             ││
│                                              │ Generates:  ││
│                                              │ • Subtitles ││
│                                              │ • Full text ││
│                                              └──────┬──────┘│
│                                                     │      │
│                                              ┌──────▼──────┐│
│  Student                                     │  S3 / MinIO ││
│  ┌──────────┐                                │             ││
│  │ Watches  │◄── CDN ◄── HLS Streaming ◄────│ video/      ││
│  │ video    │                                │  segments/  ││
│  └──────────┘                                │  manifest   ││
│                                              └─────────────┘│
└────────────────────────────────────────────────────────────┘
```

---

## 9.6 Deployment Architecture

### Development
```
Docker Compose (local)
├── api-server (Spring Boot)
├── web-app (Next.js dev server)
├── postgres
├── redis
├── rabbitmq
├── minio
├── signaling-server (Node.js)
├── mediasoup-server
└── coturn
```

### Production
```
Kubernetes Cluster
├── Namespace: dsms-app
│   ├── Deployment: api-server (3 replicas, auto-scale)
│   ├── Deployment: web-app (2 replicas)
│   ├── Deployment: signaling-server (2 replicas)
│   ├── Deployment: mediasoup-worker (auto-scale based on rooms)
│   ├── Deployment: transcoder-worker (auto-scale based on queue)
│   ├── Deployment: transcription-worker (2 replicas)
│   ├── Service: postgres (StatefulSet, 1 primary + 1 replica)
│   ├── Service: redis (StatefulSet, 1 primary + 1 replica)
│   ├── Service: rabbitmq (StatefulSet)
│   ├── Service: coturn (DaemonSet on edge nodes)
│   └── Service: minio (StatefulSet with persistent volumes)
├── Ingress: Nginx Ingress Controller (SSL termination)
├── ConfigMaps & Secrets
└── HPA (Horizontal Pod Autoscaler)
```

---

## 9.7 Project Structure

```
dsms/
├── backend/
│   ├── src/main/java/com/dsms/
│   │   ├── DsmsApplication.java
│   │   ├── config/           # Spring config, security, CORS, multi-tenancy
│   │   ├── security/         # JWT, auth filters, permission evaluators
│   │   ├── controller/       # REST controllers per module
│   │   ├── service/          # Business logic
│   │   ├── repository/       # JPA repositories
│   │   ├── domain/           # Entity classes
│   │   ├── dto/              # Request/Response DTOs
│   │   ├── exception/        # Custom exceptions & handlers
│   │   ├── event/            # Domain events, listeners
│   │   ├── scheduler/        # Scheduled tasks (reminders, cleanup)
│   │   └── util/             # Utilities
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── db/migration/     # Flyway migrations
│   │   └── templates/        # Email templates
│   ├── build.gradle
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   │   ├── (auth)/       # Login, forgot password
│   │   │   ├── (dashboard)/  # Role-specific dashboards
│   │   │   ├── meetings/     # Meeting pages
│   │   │   ├── video/        # Video conferencing & library
│   │   │   ├── notes/        # Notes module
│   │   │   ├── sessions/     # Teaching sessions
│   │   │   ├── assessments/  # Assignments, results
│   │   │   ├── attendance/   # Attendance views
│   │   │   ├── admin/        # Admin panel
│   │   │   └── layout.tsx
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── layout/       # Sidebar, header, navigation
│   │   │   ├── video/        # Video player, conferencing UI
│   │   │   ├── meetings/     # Meeting components
│   │   │   └── shared/       # Common components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # API client, utils, constants
│   │   ├── store/            # Zustand stores
│   │   └── types/            # TypeScript types
│   ├── package.json
│   └── Dockerfile
│
├── mobile/                   # (Android — Kotlin)
│   ├── app/src/main/java/com/dsms/mobile/
│   │   ├── ui/               # Screens (Compose)
│   │   ├── data/             # Repository, API, local DB
│   │   ├── domain/           # Use cases, models
│   │   ├── di/               # Dependency injection (Hilt)
│   │   └── util/             # Utilities
│   ├── build.gradle.kts
│   └── Dockerfile            # (for CI/CD builds)
│
├── video-server/             # Video infrastructure
│   ├── signaling/            # Node.js WebSocket signaling
│   ├── sfu/                  # mediasoup SFU configuration
│   ├── transcoder/           # FFmpeg transcoding workers
│   └── transcription/        # Whisper transcription service
│
├── docker-compose.yml         # Local development
├── docker-compose.prod.yml    # Production overrides
├── k8s/                      # Kubernetes manifests
│   ├── deployments/
│   ├── services/
│   ├── configmaps/
│   └── ingress/
│
├── docs/                     # Documentation
│   └── SRS/                  # This SRS
│
└── README.md
```

---

## 9.8 Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Why Spring Boot?** | Mature, secure, team familiarity | Strong security framework, excellent for RBAC, massive ecosystem |
| **Why Next.js?** | SSR + SPA flexibility | SEO for public pages, fast navigation, React ecosystem |
| **Why PostgreSQL?** | Schema-based multi-tenancy | Native schema isolation, JSONB for flexible data, proven scale |
| **Why mediasoup?** | Open-source SFU | No licensing costs, excellent performance, active community |
| **Why SFU over Mesh?** | Scalability | Mesh fails beyond 4-5 participants, SFU scales to 100+ |
| **Why SFU over MCU?** | Server load | MCU requires real-time transcoding, SFU just forwards |
| **Why self-hosted video?** | Independence | No dependency on Zoom/Meet, full control, no per-user costs |
| **Why FFmpeg for transcoding?** | Industry standard | Most powerful transcoding tool, free, supports all formats |
| **Why Whisper for STT?** | Quality + Cost | Best open-source STT, self-hostable, no per-minute costs |
| **Why schema-per-tenant?** | Data isolation | Strongest isolation without separate databases, easy backup/restore per college |
