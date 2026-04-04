package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.domain.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
	
	List<Course> findByStudentId(Long studentId);
}