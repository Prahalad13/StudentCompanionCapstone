package com.example.demo.models;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyPlanResponse {

    private Long assessmentId;
    private String title;
    private String courseName;
    private String assessmentType;
    private LocalDate dueDate;

    private long daysRemaining;

    private Integer allocatedHours;
    private Integer hoursSpent;
    private Integer remainingHours;

    private Double requiredHoursPerDay;
    private Integer progressPercentage;

    private Double weight;

    private Integer riskScore;
    private String riskLevel;

    private Integer recommendedHoursToday;

    private List<String> riskFactors;

    private String recommendation;
}