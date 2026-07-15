package com.example.demo.services;

import java.util.List;

import com.example.demo.domain.Course;
import com.example.demo.dto.TermPerformanceDTO;
import com.example.demo.dto.CoursePerformanceDTO;
import com.example.demo.dto.CourseProgressDTO;
public interface CourseService {

    List<Course> findAll();

    List<Course> findByStudentId(Long studentId);

    Course save(Course course);

    Course update(Long id, Course course);

    void delete(Long id);

    boolean hasAssessments(Long courseId);

    double calculateCoursePercentage(Long courseId);

    String calculateCourseLetterGrade(Long courseId);

    List<TermPerformanceDTO> getTermPerformance(Long studentId);
    
    List<CoursePerformanceDTO> getCoursesForTerm(
            Long studentId,
            String term
    );
    List<CourseProgressDTO> getCourseProgress(
            Long studentId,
            String term,
            String courseName);

}