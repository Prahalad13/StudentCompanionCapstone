package com.example.demo.domain;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class HealthWellness {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
    @NonNull
	private String mood; // 
	private int stressLevel; //slider
	private double sleepHours;
	private int energyLevel; //slider
	private int productivity; //slider
	private String notes; // text
    
	@NonNull
	private LocalDate dateLogged; // when it was created
	
	@ManyToOne
	@JoinColumn(name = "student_id")
	private Student student;
	
	
	

}
