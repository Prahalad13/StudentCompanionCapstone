package com.example.demo.web.rest;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.Assessment;
import com.example.demo.dto.AssessmentCompletionDTO;
import com.example.demo.services.AssessmentService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    // GET ALL
    @GetMapping
    public List<Assessment> getAll() {
        return assessmentService.findAll();
    }

    // GET BY COURSE
    @GetMapping("/course/{courseId}")
    public List<Assessment> getByCourse(@PathVariable Long courseId) {
        return assessmentService.findByCourse(courseId);
    }

    // ✅ GET BY STUDENT (NEW)
    @GetMapping("/student/{studentId}")
    public List<Assessment> getByStudent(@PathVariable Long studentId) {
        return assessmentService.findByStudentId(studentId);
    }

    // CREATE
    @PostMapping
    public Assessment create(@RequestBody Assessment assessment) {
        return assessmentService.save(assessment);
    }
    
    // Update Assessment
    @PutMapping("/{id}")
    public Assessment update(
            @PathVariable Long id,
            @RequestBody Assessment updated
    ) {
        return assessmentService.update(id, updated);
    }

    
    // Delete Assessment
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        assessmentService.delete(id);
    }
    
    @GetMapping("/date/{date}")
    public List<Assessment> getByDate(@PathVariable String date) {
        LocalDate parsedDate = LocalDate.parse(date);
        return assessmentService.getByDate(parsedDate);
    }
    @GetMapping(
    		"/student/{studentId}/completion/{term}/{course}"
    		)
    		public AssessmentCompletionDTO getCompletion(
    		        @PathVariable Long studentId,
    		        @PathVariable String term,
    		        @PathVariable String course
    		){
    		    return assessmentService
    		            .getAssessmentCompletion(
    		                    studentId,
    		                    term,
    		                    course
    		            );
    		}
}