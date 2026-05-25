package com.example.demo.services;

import java.util.List;

import com.example.demo.domain.HealthWellness;

public interface HealthWellnessService {
	List<HealthWellness>getByStudentId(Long studentId);
	HealthWellness save(HealthWellness healthWellness);
	HealthWellness update(Long id, HealthWellness healthWellness);
    void delete(Long id);

}

