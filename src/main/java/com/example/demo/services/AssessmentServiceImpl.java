package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.Assessment;
import com.example.demo.repositories.AssessmentRepository;

@Service
public class AssessmentServiceImpl implements AssessmentService {

    @Autowired
    private AssessmentRepository repo;

    public List<Assessment> findAll() {
        return repo.findAll();
    }
    
    public List<Assessment> findByStudentId(Long studentId) {   
        return repo.findByStudentId(studentId);
    }
   

    public List<Assessment> findByCourse(Long courseId) {
        return repo.findByCourseId(courseId);
    }

    public Assessment save(Assessment assessment) {
        return repo.save(assessment);
    }

	
	public void delete(Long id) {
		repo.deleteById(id);
		
	}
}