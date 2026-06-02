package com.example.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.domain.HealthWellness;

@Repository

public interface HealthWellnessRepository extends JpaRepository<HealthWellness, Long> {
    List<HealthWellness>findByStudentId(Long studentId);
}


