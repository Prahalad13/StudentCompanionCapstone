package com.example.demo.web.rest;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.Assessment;
import com.example.demo.domain.Course;
import com.example.demo.models.DashboardDTO;
import com.example.demo.repositories.AssessmentRepository;
import com.example.demo.repositories.CourseRepository;
import com.example.demo.services.AssessmentService;
import com.example.demo.services.CourseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final CourseService courseService;
    private final AssessmentService assessmentService;

    @GetMapping("/{studentId}")
    public DashboardDTO getDashboard(@PathVariable Long studentId) {

        List<Course> courses = courseService.findByStudentId(studentId);

        List<Assessment> all = assessmentService.findByStudentId(studentId);

        List<Assessment> upcoming = all.stream()
                .filter(a -> a.getDueDate().isAfter(LocalDate.now()))
                .toList();

        List<Assessment> overdue = all.stream()
                .filter(a -> a.getDueDate().isBefore(LocalDate.now()))
                .toList();

        return DashboardDTO.builder()
                .courses(courses)
                .upcoming(upcoming)
                .overdue(overdue)
                .build();
    }
}