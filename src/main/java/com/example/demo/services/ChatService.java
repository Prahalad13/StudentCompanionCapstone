package com.example.demo.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.domain.Assessment;
import com.example.demo.domain.Course;
import com.example.demo.models.ChatResponse;
import com.example.demo.repositories.AssessmentRepository;
import com.example.demo.repositories.CourseRepository;
import com.example.demo.repositories.StudentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final RestTemplate restTemplate;
    private final CourseRepository courseRepository;
    private final AssessmentRepository assessmentRepository;
    private final StudentRepository studentRepository;

    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL = "llama-3.3-70b-versatile";

    public ChatResponse chat(Long studentId, String userMessage) {

        String studentName = studentRepository.findById(studentId)
            .map(s -> s.getName())
            .orElse("Student");

        List<Course> courses = courseRepository.findByStudentId(studentId);
        List<Assessment> assessments = assessmentRepository.findByStudentIdOrderByDueDateAsc(studentId);

        LocalDate today = LocalDate.now();

        StringBuilder systemPrompt = new StringBuilder();
        systemPrompt.append("You are an academic assistant for a student named ").append(studentName).append(".\n");
        systemPrompt.append("Today's date is ").append(today).append(".\n\n");

        systemPrompt.append("ENROLLED COURSES:\n");
        if (courses.isEmpty()) {
            systemPrompt.append("  (no courses enrolled yet)\n");
        } else {
            for (Course c : courses) {
                systemPrompt.append("  - ").append(c.getCourseName()).append(" (").append(c.getTerm()).append(")\n");
            }
        }

        systemPrompt.append("\nUPCOMING ASSESSMENTS (due on or after today):\n");
        List<Assessment> upcoming = assessments.stream()
            .filter(a -> a.getDueDate() != null && !a.getDueDate().isBefore(today))
            .toList();
        if (upcoming.isEmpty()) {
            systemPrompt.append("  (none)\n");
        } else {
            for (Assessment a : upcoming) {
                long daysLeft = today.until(a.getDueDate()).getDays();
                systemPrompt.append("  - ").append(a.getTitle())
                    .append(" | Course: ").append(a.getCourse() != null ? a.getCourse().getCourseName() : "N/A")
                    .append(" | Due: ").append(a.getDueDate())
                    .append(" (in ").append(daysLeft).append(" day(s))\n");
            }
        }

        systemPrompt.append("\nOVERDUE ASSESSMENTS (past due date):\n");
        List<Assessment> overdue = assessments.stream()
            .filter(a -> a.getDueDate() != null && a.getDueDate().isBefore(today))
            .toList();
        if (overdue.isEmpty()) {
            systemPrompt.append("  (none)\n");
        } else {
            for (Assessment a : overdue) {
                systemPrompt.append("  - ").append(a.getTitle())
                    .append(" | Course: ").append(a.getCourse() != null ? a.getCourse().getCourseName() : "N/A")
                    .append(" | Was due: ").append(a.getDueDate()).append("\n");
            }
        }

        systemPrompt.append("\nYour role: Help the student with study advice, time management, ")
            .append("understanding their courses, and academic motivation. ")
            .append("Reference their actual courses and assessments when relevant. ")
            .append("Be concise, friendly, and practical.");

        Map<String, Object> requestBody = Map.of(
            "model", MODEL,
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt.toString()),
                Map.of("role", "user",   "content", userMessage)
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestBody, headers);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(GROQ_URL, httpEntity, Map.class);

            String reply = "Sorry, I couldn't generate a response.";
            if (response != null && response.containsKey("choices")) {
                List<?> choices = (List<?>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<?, ?> choice = (Map<?, ?>) choices.get(0);
                    Map<?, ?> message = (Map<?, ?>) choice.get("message");
                    reply = (String) message.get("content");
                }
            }
            return new ChatResponse(reply);

        } catch (Exception e) {
            return new ChatResponse("I'm having trouble connecting right now. Please try again in a moment.");
        }
    }
}