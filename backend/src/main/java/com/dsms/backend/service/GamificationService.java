package com.dsms.backend.service;

import com.dsms.backend.domain.StudentGamification;
import com.dsms.backend.domain.User;
import com.dsms.backend.repository.StudentGamificationRepository;
import com.dsms.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class GamificationService {

    private final StudentGamificationRepository gamificationRepository;
    private final UserRepository userRepository;

    public GamificationService(StudentGamificationRepository gamificationRepository, UserRepository userRepository) {
        this.gamificationRepository = gamificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void processAttendanceGamification(UUID studentId) {
        StudentGamification gamification = gamificationRepository.findByStudentId(studentId)
                .orElseGet(() -> {
                    StudentGamification newGame = new StudentGamification();
                    User student = userRepository.findById(studentId).orElseThrow();
                    newGame.setStudent(student);
                    return newGame;
                });

        ZonedDateTime now = ZonedDateTime.now();
        
        // Update XP
        gamification.setTotalXp(gamification.getTotalXp() + 10); // 10 XP for attending

        // Update Streak
        if (gamification.getLastAttendanceDate() == null) {
            gamification.setCurrentStreak(1);
        } else {
            long daysBetween = ChronoUnit.DAYS.between(gamification.getLastAttendanceDate().toLocalDate(), now.toLocalDate());
            
            if (daysBetween == 1) {
                // Consecutive day
                gamification.setCurrentStreak(gamification.getCurrentStreak() + 1);
            } else if (daysBetween > 1) {
                // Streak broken
                gamification.setCurrentStreak(1);
            }
            // If daysBetween == 0, multiple attendances in same day, streak doesn't increment but doesn't break
        }

        // Update longest streak
        if (gamification.getCurrentStreak() > gamification.getLongestStreak()) {
            gamification.setLongestStreak(gamification.getCurrentStreak());
        }

        gamification.setLastAttendanceDate(now);
        gamificationRepository.save(gamification);
    }
    
    public Optional<StudentGamification> getGamificationStats(UUID studentId) {
        return gamificationRepository.findByStudentId(studentId);
    }
}
