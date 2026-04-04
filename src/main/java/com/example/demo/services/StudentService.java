package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import com.example.demo.domain.Student;
import com.example.demo.domain.User;

public interface StudentService {
    List<Student> findAll();
    Student save(Student student);
    
    Optional<Student> findByUser(User user);
    
	Optional<Student> findByUserId(Long userId);

}
