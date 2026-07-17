package com.dsms.backend.repository;

import com.dsms.backend.domain.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TimetableEntryRepository extends JpaRepository<TimetableEntry, UUID> {
    List<TimetableEntry> findByFacultyIdAndStartTimeBetween(UUID facultyId, ZonedDateTime start, ZonedDateTime end);
    List<TimetableEntry> findByBatchYearAndStartTimeBetween(String batchYear, ZonedDateTime start, ZonedDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(t) FROM TimetableEntry t WHERE t.faculty.id = :facultyId AND t.startTime < :endTime AND t.endTime > :startTime")
    long countFacultyConflicts(UUID facultyId, ZonedDateTime startTime, ZonedDateTime endTime);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(t) FROM TimetableEntry t WHERE t.facility.id = :facilityId AND t.startTime < :endTime AND t.endTime > :startTime")
    long countFacilityConflicts(UUID facilityId, ZonedDateTime startTime, ZonedDateTime endTime);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(t) FROM TimetableEntry t WHERE t.batchYear = :batchYear AND t.startTime < :endTime AND t.endTime > :startTime")
    long countBatchConflicts(String batchYear, ZonedDateTime startTime, ZonedDateTime endTime);
}
