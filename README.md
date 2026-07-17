# Doctor Management System (DSMS)

The Doctor Management System (DSMS) is an integrated, multi-tenant enterprise resource planning (ERP) platform designed specifically for medical colleges and healthcare institutions. It provides comprehensive tools for faculty, administrators, and students, streamlining operations, academics, and clinical management.

## 🌟 Key Features

### 1. Robust Core Infrastructure
- **Multi-Tenant Architecture**: Supports multiple distinct colleges and hospitals on a single centralized deployment via Spring Boot and PostgreSQL.
- **Role-Based Access Control (RBAC)**: Secure access tailored to Super Admins, Institution Admins, HODs, Professors, and Students.
- **Audit Logging**: Comprehensive tracking of all critical system actions using Spring Data JPA Envers.

### 2. Comprehensive Academic Modules
- **Attendance & Timetables**: Automated timetables for both academic classes and clinical duties, alongside real-time attendance tracking with interactive dashboards.
- **Assignments**: End-to-end assignment workflow allowing faculty to create and grade coursework and students to submit assignments securely.

### 3. Student Engagement Layer
- **Gamification Engine**: Motivates students through XP tracking and attendance streaks.
- **Interactive Dashboards**: Role-specific, data-rich dashboards powered by `framer-motion` and `@tanstack/react-table` for sorting, filtering, and data visualization.
- **Onboarding Guides**: First-time user interactive product tours using `driver.js`.

### 4. Advanced Clinical & Learning Tools
- **Clinical Rotations**: Robust scheduling for HODs to manage ward assignments for residents and interns.
- **Video Learning Library**: An on-demand video platform simulating complex FFmpeg media processing pipelines.
- **Live Telemedicine Classes**: A simulated WebRTC interface featuring real-time AI transcription (Closed Captions) powered by Server-Sent Events (SSE).

## 🛠️ Technology Stack

**Backend:**
- Java 17 + Spring Boot 3
- Spring Security (JWT Authentication)
- PostgreSQL (Multi-tenant schema routing)
- Hibernate & JPA

**Frontend (Web):**
- React 18 + Next.js 14 (App Router)
- Tailwind CSS
- Lucide React (Icons)
- Framer Motion (Animations)
- Recharts (Data Visualization)
- TanStack React Table

**Mobile (Upcoming):**
- React Native / Expo

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL
- Docker & Docker Compose (Optional, for database deployment)

### 1. Database Setup
A `docker-compose.yml` file is included in the root directory to quickly spin up a PostgreSQL instance.
```bash
docker-compose up -d
```

### 2. Running the Backend
Navigate to the `backend` directory and run the Spring Boot application using Gradle:
```bash
cd backend
./gradlew bootRun
```
*The backend will be available at http://localhost:8080*

### 3. Running the Frontend
Navigate to the `frontend` directory, install dependencies, and start the Next.js development server:
```bash
cd frontend
npm install
npm run dev
```
*The web application will be available at http://localhost:3000*

## 📱 Mobile Application
The mobile application scaffold is located in the `mobile` directory. You can run it using the Expo CLI:
```bash
cd mobile
npm install
npm run start
```

## 🔒 Authentication
Initial setup instructions and default mock user credentials can be configured directly via the database seed files or by manually registering an institution admin account. Ensure that a valid Tenant ID is passed when making cross-tenant API calls.
