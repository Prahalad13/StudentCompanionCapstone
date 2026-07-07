package com.example.demo.web.rest;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.models.SummaryResponse;
import com.example.demo.services.SummarizerService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/summarize")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class SummarizerController {

    private final SummarizerService summarizerService;

    /**
     * POST /api/v1/summarize
     * Accepts a multipart file (PDF, DOCX, or TXT) and returns an AI-generated summary.
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<SummaryResponse> summarize(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String name = file.getOriginalFilename() != null
                ? file.getOriginalFilename().toLowerCase()
                : "";

        if (!name.endsWith(".pdf") && !name.endsWith(".docx") && !name.endsWith(".txt")) {
            return ResponseEntity.badRequest()
                .body(new SummaryResponse(
                    "Unsupported file type. Please upload a PDF, DOCX, or TXT file.",
                    file.getOriginalFilename()
                ));
        }

        try {
            SummaryResponse response = summarizerService.summarize(file);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            System.err.println("File read error: " + e.getMessage());
            return ResponseEntity.internalServerError()
                .body(new SummaryResponse(
                    "Failed to read the file. Please try again.",
                    file.getOriginalFilename()
                ));
        }
    }
}