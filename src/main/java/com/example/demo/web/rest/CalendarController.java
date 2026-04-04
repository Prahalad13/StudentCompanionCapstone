package com.example.demo.web.rest;

import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.Assessment;
import com.example.demo.repositories.AssessmentRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final AssessmentRepository repo;

    @GetMapping("/{studentId}")
    public List<Assessment> getCalendar(@PathVariable Long studentId) {
        return repo.findByStudentIdOrderByDueDateAsc(studentId);
    }
}