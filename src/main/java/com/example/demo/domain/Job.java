package com.example.demo.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    private String title;

    private String city;

    private String type;
    
    private String applyLink;
    
    private String companyName;
}