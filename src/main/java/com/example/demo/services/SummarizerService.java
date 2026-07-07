package com.example.demo.services;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.models.SummaryResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SummarizerService {

    private final RestTemplate restTemplate;

    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GROQ_URL  = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL     = "llama-3.3-70b-versatile";
    // ~3 000 tokens worth of input – keeps Groq response fast
    private static final int    MAX_CHARS = 12_000;

    // ── PUBLIC ENTRY POINT ────────────────────────────────────────────────────

    public SummaryResponse summarize(MultipartFile file) throws IOException {

        String text = extractText(file);

        if (text == null || text.isBlank()) {
            return new SummaryResponse(
                "⚠️ Could not extract readable text from this file. "
                    + "Make sure it is a text-based PDF (not a scanned image), a .docx, or a .txt file.",
                file.getOriginalFilename()
            );
        }

        // Truncate very large documents so we stay within model limits
        if (text.length() > MAX_CHARS) {
            text = text.substring(0, MAX_CHARS)
                + "\n\n[Note: content was truncated to fit the AI's input limit]";
        }

        String summary = callGroq(text);
        return new SummaryResponse(summary, file.getOriginalFilename());
    }

    // ── TEXT EXTRACTION ───────────────────────────────────────────────────────

    private String extractText(MultipartFile file) throws IOException {

        String name = file.getOriginalFilename() != null
                ? file.getOriginalFilename().toLowerCase()
                : "";

        if (name.endsWith(".pdf")) {
            try (PDDocument doc = PDDocument.load(file.getInputStream())) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(doc);
            }
        }

        if (name.endsWith(".docx")) {
            try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {
                XWPFWordExtractor extractor = new XWPFWordExtractor(doc);
                String text = extractor.getText();
                extractor.close();
                return text;
            }
        }

        if (name.endsWith(".txt")) {
            return new String(file.getBytes());
        }

        return null; // unsupported type
    }

    // ── GROQ API CALL ─────────────────────────────────────────────────────────

    private String callGroq(String noteText) {

        String systemPrompt = """
                You are an AI academic assistant that summarizes lecture notes and study materials for students.
                Given the uploaded text, produce a clear, well-structured summary using EXACTLY this format:

                ## 📋 Overview
                Write 2–3 sentences describing what the material is about.

                ## 🔑 Key Topics
                - List each main topic as a bullet point

                ## 💡 Key Concepts & Definitions
                - **Term**: brief explanation
                - (repeat for each important concept)

                ## ⭐ Important Points to Remember
                - List the 3–5 most critical takeaways as bullet points

                ## 📚 Study Tips
                - 1–2 practical suggestions for mastering this material

                Be concise, accurate, and student-friendly. Use plain language.
                """;

        Map<String, Object> body = Map.of(
            "model",    MODEL,
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user",   "content",
                       "Please summarize the following lecture notes:\n\n" + noteText)
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response =
                restTemplate.postForObject(GROQ_URL, request, Map.class);

            if (response != null && response.containsKey("choices")) {
                List<?> choices = (List<?>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<?, ?> choice  = (Map<?, ?>) choices.get(0);
                    Map<?, ?> message = (Map<?, ?>) choice.get("message");
                    return (String) message.get("content");
                }
            }
        } catch (Exception e) {
            System.err.println("Groq API error in SummarizerService: " + e.getMessage());
            return "⚠️ Could not reach the AI service. Please try again in a moment.";
        }

        return "⚠️ The AI did not return a usable response. Please try again.";
    }
}