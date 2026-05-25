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
    public List<HealthWellness> getByStudent(@PathVariable Long studentId) {
        return wellnessService.getByStudentId(studentId);
    }

    @PostMapping
    public HealthWellness create(@RequestBody HealthWellness wellness) {
        return wellnessService.save(wellness);
    }

    @PutMapping("/{id}")
    public HealthWellness update(@PathVariable Long id, @RequestBody HealthWellness wellness) {
        return wellnessService.update(id, wellness);
    }
}
