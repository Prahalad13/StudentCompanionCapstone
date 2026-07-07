package com.example.demo.models;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;
    private Long studentId;
}