package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.Course;
import com.example.demo.repositories.CourseRepository;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository repo;

    public List<Course> findAll() {
        return repo.findAll();
    }
    
    public List<Course> findByStudentId(Long studentId) {  
        return repo.findByStudentId(studentId);
    }

    public Course save(Course course) {
        return repo.save(course);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}