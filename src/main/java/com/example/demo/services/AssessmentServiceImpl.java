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
    
    @Override
    public Assessment update(Long id, Assessment updated) {
        Assessment existing = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Assessment not found"));

        existing.setTitle(updated.getTitle());
        existing.setDueDate(updated.getDueDate());
        existing.setGrade(updated.getGrade());
        existing.setTotalMarks(updated.getTotalMarks());
        existing.setCompleted(updated.getCompleted());
        existing.setStudyHours(updated.getStudyHours());
        existing.setWeight(updated.getWeight());
        existing.setCourse(updated.getCourse());
        existing.setStudent(updated.getStudent());

        return repo.save(existing);
    }


	
	public void delete(Long id) {
		repo.deleteById(id);
		
	}
}