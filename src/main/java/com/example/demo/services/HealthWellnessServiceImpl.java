package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.domain.HealthWellness;
import com.example.demo.repositories.HealthWellnessRepository;

@Service
public class HealthWellnessServiceImpl implements HealthWellnessService {

    @Autowired
    private HealthWellnessRepository repo;

    @Override
    public List<HealthWellness>getByStudentId(Long studentId) {
        return repo.findByStudentId(studentId);
    }

    @Override
    public HealthWellness save(HealthWellness wellness) {
        return repo.save(wellness);
    }

    @Override
    public HealthWellness update(Long id, HealthWellness wellness) {
        wellness.setId(id);
        return repo.save(wellness);
    }
    
    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
