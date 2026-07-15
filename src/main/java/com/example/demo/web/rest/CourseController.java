package com.example.demo.web.rest;

import java.util.List;

import com.example.demo.dto.CoursePerformanceDTO;
import com.example.demo.dto.CourseProgressDTO;
import com.example.demo.dto.TermPerformanceDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    
    @PutMapping("/{id}")
    public Course update(@PathVariable Long id, @RequestBody Course course) {
        return courseService.update(id, course);
    }


    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {

        if (courseService.hasAssessments(id)) {
            return ResponseEntity
                    .status(409)
                    .body("HAS_ASSESSMENTS");
        }

        courseService.delete(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/student/{studentId}/performance")
    public List<TermPerformanceDTO> getTermPerformance(
            @PathVariable Long studentId) {

        return courseService.getTermPerformance(studentId);
    }
    @GetMapping("/student/{studentId}/performance/{term}")
    public List<CoursePerformanceDTO> getCoursesForTerm(
            @PathVariable Long studentId,
            @PathVariable String term) {

        return courseService.getCoursesForTerm(studentId, term);
    }
    @GetMapping(
    		"/student/{studentId}/term/{term}/course/{courseName}")
    		public List<CourseProgressDTO> getCourseProgress(

    		        @PathVariable Long studentId,
    		        @PathVariable String term,
    		        @PathVariable String courseName){

    		    return courseService.getCourseProgress(
    		            studentId,
    		            term,
    		            courseName);
    		}

}