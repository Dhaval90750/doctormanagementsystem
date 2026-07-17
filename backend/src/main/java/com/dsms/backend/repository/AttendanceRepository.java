package com.dsms.backend.repository;

import com.dsms.backend.domain.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    List<Attendance> findByTimetableEntryId(UUID timetableEntryId);
    boolean existsByTimetableEntryIdAndStudentId(UUID timetableEntryId, UUID studentId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    long countTotalByStudent(UUID studentId);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    long countPresentByStudent(UUID studentId);
}
