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

    @ManyToOne
    @NonNull
    private Course course;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
