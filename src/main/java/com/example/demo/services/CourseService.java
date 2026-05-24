package com.example.demo.services;

import java.util.List;

import com.example.demo.domain.Course;

public interface CourseService {
	 List<Course> findAll();
	    List<Course> findByStudentId(Long studentId);
	    Course save(Course course);
	    Course update(Long id, Course course);
	    void delete(Long id);
}
