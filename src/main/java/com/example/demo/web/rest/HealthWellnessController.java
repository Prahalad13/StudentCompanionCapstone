package com.example.demo.web.rest;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import com.example.demo.domain.HealthWellness;
import com.example.demo.services.HealthWellnessService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/healthwellness")
@RequiredArgsConstructor
public class HealthWellnessController {

    private final HealthWellnessService wellnessService;

    @GetMapping("/student/{studentId}")
    public List<HealthWellness> getByStudentId(@PathVariable Long studentId) {
        return wellnessService.getByStudentId(studentId);
    }
    
    @GetMapping("/{id}") // edit
    public HealthWellness getById(@PathVariable Long id) {
        return wellnessService.getById(id);
    }
    
    @PostMapping
    public HealthWellness create(@RequestBody HealthWellness wellness) {
        return wellnessService.save(wellness);
    }

    @PutMapping("/{id}")
    public HealthWellness update(@PathVariable Long id, @RequestBody HealthWellness wellness) {
        return wellnessService.update(id, wellness);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        wellnessService.delete(id);
    }
}
