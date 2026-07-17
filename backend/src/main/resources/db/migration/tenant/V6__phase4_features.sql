-- Phase 4 Advanced Features Migration

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_role VARCHAR(50),
    target_department_id UUID,
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topic_id UUID,
    created_by UUID REFERENCES users(id),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_marks INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id),
    content TEXT,
    file_url VARCHAR(1024),
    marks_awarded INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clinical_rotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id),
    supervisor_id UUID REFERENCES users(id),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rotation_rosters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rotation_id UUID REFERENCES clinical_rotations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id),
    status VARCHAR(50),
    supervisor_feedback TEXT,
    grade INTEGER
);

CREATE TABLE video_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topic_id UUID,
    uploaded_by UUID REFERENCES users(id),
    thumbnail_url VARCHAR(1024),
    hls_playlist_url VARCHAR(1024),
    original_file_url VARCHAR(1024),
    duration_seconds BIGINT,
    status VARCHAR(50),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
