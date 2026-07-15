package com.example.demo.dto;

import lombok.Data;

@Data
public class CoursePerformanceDTO {

    private String courseName;

    private String term;

    private Double percentage;

    private String letterGrade;

    private Boolean completed;

}