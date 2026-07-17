package com.dsms.backend.service;

import com.dsms.backend.domain.Attendance;
import com.dsms.backend.domain.TimetableEntry;
import com.dsms.backend.domain.User;
import com.dsms.backend.dto.AttendanceDto;
import com.dsms.backend.repository.AttendanceRepository;
import com.dsms.backend.repository.TimetableEntryRepository;
import com.dsms.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final TimetableEntryRepository timetableEntryRepository;
    private final UserRepository userRepository;
    private final GamificationService gamificationService;

    public AttendanceService(AttendanceRepository attendanceRepository, TimetableEntryRepository timetableEntryRepository, UserRepository userRepository, GamificationService gamificationService) {
        this.attendanceRepository = attendanceRepository;
        this.timetableEntryRepository = timetableEntryRepository;
        this.userRepository = userRepository;
        this.gamificationService = gamificationService;
    }

    @Transactional
    public Attendance markAttendance(AttendanceDto dto) {
        if (attendanceRepository.existsByTimetableEntryIdAndStudentId(dto.getTimetableEntryId(), dto.getStudentId())) {
            throw new IllegalArgumentException("Attendance already marked for this student in this session");
        }

        TimetableEntry entry = timetableEntryRepository.findById(dto.getTimetableEntryId())
                .orElseThrow(() -> new RuntimeException("Timetable entry not found"));
        User student = userRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        User marker = null;
        if (dto.getMarkedBy() != null) {
            marker = userRepository.findById(dto.getMarkedBy()).orElse(null);
        }

        Attendance attendance = new Attendance();
        attendance.setTimetableEntry(entry);
        attendance.setStudent(student);
        attendance.setStatus(dto.getStatus());
        attendance.setMarkedBy(marker);
        attendance.setQrScanned(dto.isQrScanned());

        Attendance saved = attendanceRepository.save(attendance);
        
        if ("PRESENT".equalsIgnoreCase(dto.getStatus())) {
            gamificationService.processAttendanceGamification(student.getId());
        }
        
        return saved;
    }

    public List<Attendance> getAttendanceBySession(UUID sessionId) {
        return attendanceRepository.findByTimetableEntryId(sessionId);
    }

    public double calculateAttendancePercentage(UUID studentId) {
        long total = attendanceRepository.countTotalByStudent(studentId);
        if (total == 0) return 0.0;
        long present = attendanceRepository.countPresentByStudent(studentId);
        return Math.round(((double) present / total) * 100.0 * 100.0) / 100.0; // round to 2 decimal places
    }
}
