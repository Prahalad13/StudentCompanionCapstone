package com.example.demo.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.domain.Assessment;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByCourseId(Long courseId);
    List<Assessment> findByDueDateAfter(LocalDate date);
    List<Assessment> findByDueDateBefore(LocalDate date);
    List<Assessment> findByStudentId(Long studentId);

    List<Assessment> findByStudentIdOrderByDueDateAsc(Long studentId);
}