package com.example.demo.bootstrap;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.domain.Assessment;
import com.example.demo.domain.Course;
import com.example.demo.services.AssessmentService;
import com.example.demo.services.CourseService;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private CourseService courseService;

    @Autowired
    private AssessmentService assessmentService;

    @Override
    public void run(String... args) {
        if (courseService.findAll().isEmpty()) {
            Course c1 = courseService.save(new Course("Java", "Winter"));
            Course c2 = courseService.save(new Course("Angular", "Winter"));

            assessmentService.save(new Assessment("Midterm", LocalDate.now().plusDays(5), c1));
            assessmentService.save(new Assessment("Assignment", LocalDate.now().plusDays(2), c2));
        }
    }
}