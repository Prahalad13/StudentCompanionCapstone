package com.example.demo.domain;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String title;

    @NonNull
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private AssessmentType assessmentType;

    // Maximum marks
    private Double totalMarks;

    // Marks obtained
    private Double achievedMarks;

    // Calculated percentage
    private Double percentage;

    // Letter grade
    private String letterGrade;

    // Automatically assigned
    private Double weight = 0.0;

    private Boolean completed = false;

    // Planned study hours
    private Integer allocatedStudyHours = 0;

    // Actual study hours
    private Integer hoursSpent = 0;

    @ManyToOne
    @NonNull
    private Course course;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}