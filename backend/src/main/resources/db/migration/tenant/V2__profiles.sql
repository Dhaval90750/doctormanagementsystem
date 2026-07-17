CREATE TABLE student_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    enrollment_number VARCHAR(100) UNIQUE,
    batch_year VARCHAR(20),
    course_type VARCHAR(20),
    date_of_admission DATE,
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20)
);

CREATE TABLE faculty_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(100) UNIQUE,
    designation VARCHAR(100),
    specialization VARCHAR(100),
    joining_date DATE,
    medical_registration_number VARCHAR(100)
);
