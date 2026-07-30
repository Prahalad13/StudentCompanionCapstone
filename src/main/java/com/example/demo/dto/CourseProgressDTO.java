package com.example.demo.dto;

import lombok.Data;

@Data
public class CourseProgressDTO {
	private Long id;
    private String assessmentName;
    private Double percentage;
    private Boolean completed;
    private Integer allocatedStudyHours;
    private Integer hoursSpent;

}
