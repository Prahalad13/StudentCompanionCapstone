package com.example.demo.services;

import java.util.List;

import com.example.demo.domain.Assessment;

public interface AssessmentService {
    List<Assessment> findAll();
    List<Assessment> findByStudentId(Long studentId); 
    List<Assessment> findByCourse(Long courseId);
    Assessment save(Assessment assessment);
    void delete(Long id);

    
}