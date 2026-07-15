package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TermPerformanceDTO {

    private String term;

    // Average percentage for this term
    private Double averagePercentage;

    // Overall grade for this term
    private String letterGrade;

    // Number of courses
    private Integer totalCourses;

    // Completed courses
    private Integer completedCourses;

    // Courses still in progress
    private Integer inProgressCourses;

    // True if every course in this term is completed
    private Boolean completed;

}