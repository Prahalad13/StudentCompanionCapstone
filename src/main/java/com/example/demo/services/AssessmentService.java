package com.example.demo.services;

import java.time.LocalDate;
import com.example.demo.models.StudyPlanResponse;
import java.util.List;

import com.example.demo.domain.Assessment;
import com.example.demo.dto.AssessmentCompletionDTO;
import com.example.demo.dto.AssessmentStudyRequest;

public interface AssessmentService {
	List<StudyPlanResponse> getStudyPlan(Long studentId);
    List<Assessment> findAll();
    List<Assessment> findByStudentId(Long studentId); 
    List<Assessment> findByCourse(Long courseId);
    Assessment save(Assessment assessment);
    Assessment update(Long id, Assessment updated);
    void delete(Long id);
    
    List<Assessment> getByDate(LocalDate date);
    AssessmentCompletionDTO getAssessmentCompletion(
            Long studentId,
            String term,
            String courseName);
    List<Assessment> getPendingAssessments(Long studentId, Long courseId);

    void addStudyHours(AssessmentStudyRequest request);    
}