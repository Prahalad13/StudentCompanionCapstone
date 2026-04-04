package com.example.demo.models;

import java.util.List;

import com.example.demo.domain.Assessment;
import com.example.demo.domain.Course;

import lombok.*;

@Data
@Builder
public class DashboardDTO {
    private List<Course> courses;
    private List<Assessment> upcoming;
    private List<Assessment> overdue;
}