package com.example.demo.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.Course;
import com.example.demo.repositories.CourseRepository;
import com.example.demo.services.CourseService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // GET ALL
    @GetMapping
    public List<Course> getAll() {
        return courseService.findAll();
    }

    // ✅ GET BY STUDENT (NEW)
    @GetMapping("/student/{studentId}")
    public List<Course> getByStudent(@PathVariable Long studentId) {
        return courseService.findByStudentId(studentId);
    }

    // CREATE
    @PostMapping
    public Course create(@RequestBody Course course) {
        return courseService.save(course);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        courseService.delete(id);
    }
}