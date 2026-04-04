package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.Student;
import com.example.demo.domain.User;
import com.example.demo.repositories.StudentRepository;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository repo;

    @Override
    public List<Student> findAll() {
        return repo.findAll();
    }

    @Override
    public Student save(Student student) {
        return repo.save(student);
    }

    

    @Override
	public Optional<Student> findByUser(User user) {
		// TODO Auto-generated method stub
		return repo.findByUser(user);
	}
    
    @Override
    public Optional<Student> findByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

}
