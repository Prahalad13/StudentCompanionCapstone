package com.example.demo.services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.Assessment;
import com.example.demo.domain.AssessmentType;
import com.example.demo.dto.AssessmentCompletionDTO;
import com.example.demo.dto.AssessmentStudyRequest;
import com.example.demo.models.StudyPlanResponse;
import com.example.demo.repositories.AssessmentRepository;

@Service
public class AssessmentServiceImpl implements AssessmentService {

    @Autowired
    private AssessmentRepository repo;

    @Override
    public List<Assessment> findAll() {
        return repo.findAll();
    }

    @Override
    public List<Assessment> findByStudentId(Long studentId) {
        return repo.findByStudentId(studentId);
    }

    @Override
    public List<Assessment> findByCourse(Long courseId) {
        return repo.findByCourseId(courseId);
    }

    @Override
    public Assessment save(Assessment assessment) {

        double weight = getWeight(assessment.getAssessmentType());
        assessment.setWeight(weight);

        if (Boolean.TRUE.equals(assessment.getCompleted())) {

            double percentage = calculatePercentage(
                    assessment.getAchievedMarks(),
                    assessment.getTotalMarks()
            );

            assessment.setPercentage(percentage);
            assessment.setLetterGrade(calculateLetterGrade(percentage));

        } else {
            assessment.setAchievedMarks(null);
            assessment.setPercentage(null);
            assessment.setLetterGrade(null);
        }

        return repo.save(assessment);
    }

    @Override
    public Assessment update(Long id, Assessment updated) {

        Assessment existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        existing.setTitle(updated.getTitle());
        existing.setDueDate(updated.getDueDate());
        existing.setAssessmentType(updated.getAssessmentType());
        existing.setTotalMarks(updated.getTotalMarks());
        existing.setCompleted(updated.getCompleted());
        existing.setAllocatedStudyHours(updated.getAllocatedStudyHours());
        existing.setHoursSpent(updated.getHoursSpent());
        existing.setCourse(updated.getCourse());
        existing.setStudent(updated.getStudent());

        existing.setWeight(getWeight(updated.getAssessmentType()));

        if (Boolean.TRUE.equals(updated.getCompleted())) {

            existing.setAchievedMarks(updated.getAchievedMarks());

            double percentage = calculatePercentage(
                    updated.getAchievedMarks(),
                    updated.getTotalMarks()
            );

            existing.setPercentage(percentage);
            existing.setLetterGrade(calculateLetterGrade(percentage));

        } else {
            existing.setAchievedMarks(null);
            existing.setPercentage(null);
            existing.setLetterGrade(null);
        }

        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public List<Assessment> getByDate(LocalDate date) {
        return repo.findByDueDate(date);
    }

    private double getWeight(AssessmentType type) {

        if (type == null) {
            return 0.0;
        }

        return switch (type) {
            case QUIZ -> 10.0;
            case ASSIGNMENT -> 15.0;
            case MIDTERM -> 30.0;
            case FINAL -> 30.0;
            case PROJECT -> 15.0;
        };
    }

    private double calculatePercentage(
            Double achievedMarks,
            Double totalMarks) {

        if (achievedMarks == null
                || totalMarks == null
                || totalMarks <= 0) {
            return 0.0;
        }

        return (achievedMarks / totalMarks) * 100.0;
    }

    private String calculateLetterGrade(double percentage) {

        if (percentage >= 90) {
            return "A+";
        }

        if (percentage >= 80) {
            return "A";
        }

        if (percentage >= 70) {
            return "B";
        }

        if (percentage >= 60) {
            return "C";
        }

        if (percentage >= 50) {
            return "D";
        }

        return "F";
    }

    @Override
    public AssessmentCompletionDTO getAssessmentCompletion(
            Long studentId,
            String term,
            String courseName) {

        List<Assessment> allAssessments =
                repo.findByStudentId(studentId);

        int completed = 0;
        int upcoming = 0;
        int overdue = 0;

        LocalDate today = LocalDate.now();

        for (Assessment assessment : allAssessments) {

            if (assessment.getCourse() == null
                    || assessment.getCourse().getTerm() == null
                    || !assessment.getCourse().getTerm().equals(term)) {
                continue;
            }

            if (!assessment.getCourse()
                    .getCourseName()
                    .equals(courseName)) {
                continue;
            }

            if (Boolean.TRUE.equals(assessment.getCompleted())) {
                completed++;
            } else if (assessment.getDueDate() != null
                    && assessment.getDueDate().isBefore(today)) {
                overdue++;
            } else {
                upcoming++;
            }
        }

        return new AssessmentCompletionDTO(
                completed,
                upcoming,
                overdue
        );
    }

    @Override
    public List<Assessment> getPendingAssessments(
            Long studentId,
            Long courseId) {

        return repo
                .findByStudentIdAndCourseIdAndCompletedFalseOrderByDueDateAsc(
                        studentId,
                        courseId
                );
    }

    @Override
    public void addStudyHours(AssessmentStudyRequest request) {

        Assessment assessment = repo
                .findById(request.getAssessmentId())
                .orElseThrow(() ->
                        new RuntimeException("Assessment not found"));

        int currentHours = assessment.getHoursSpent() == null
                ? 0
                : assessment.getHoursSpent();

        assessment.setHoursSpent(
                currentHours + request.getHours()
        );

        repo.save(assessment);
    }

    @Override
    public List<StudyPlanResponse> getStudyPlan(Long studentId) {

        LocalDate today = LocalDate.now();

        return repo.findByStudentIdOrderByDueDateAsc(studentId)
                .stream()
                .filter(assessment ->
                        assessment.getCompleted() == null
                                || !assessment.getCompleted()
                )
                .map(assessment -> {

                    int allocatedHours =
                            assessment.getAllocatedStudyHours() == null
                                    ? 0
                                    : assessment.getAllocatedStudyHours();

                    int hoursSpent =
                            assessment.getHoursSpent() == null
                                    ? 0
                                    : assessment.getHoursSpent();

                    int remainingHours = Math.max(
                            allocatedHours - hoursSpent,
                            0
                    );

                    long daysRemaining =
                            ChronoUnit.DAYS.between(
                                    today,
                                    assessment.getDueDate()
                            );

                    double weight =
                            assessment.getWeight() == null
                                    ? 0.0
                                    : assessment.getWeight();

                    String riskLevel;

                    if (daysRemaining < 0) {
                        riskLevel = "OVERDUE";
                    } else if (
                            daysRemaining <= 2
                                    || remainingHours > daysRemaining * 2
                                    || weight >= 30
                    ) {
                        riskLevel = "HIGH";
                    } else if (
                            daysRemaining <= 7
                                    || remainingHours > daysRemaining
                    ) {
                        riskLevel = "MEDIUM";
                    } else {
                        riskLevel = "LOW";
                    }

                    int recommendedHoursToday;

                    if (remainingHours == 0) {
                        recommendedHoursToday = 0;
                    } else if (daysRemaining <= 0) {
                        recommendedHoursToday = remainingHours;
                    } else {
                        recommendedHoursToday = (int) Math.ceil(
                                (double) remainingHours / daysRemaining
                        );

                        recommendedHoursToday = Math.max(
                                recommendedHoursToday,
                                1
                        );
                    }

                    String recommendation;

                    if (remainingHours == 0) {
                        recommendation =
                                "All planned study hours are complete.";
                    } else if (daysRemaining < 0) {
                        recommendation =
                                "This assessment is overdue. Complete it as soon as possible.";
                    } else if ("HIGH".equals(riskLevel)) {
                        recommendation =
                                "This assessment should be your highest priority today.";
                    } else if ("MEDIUM".equals(riskLevel)) {
                        recommendation =
                                "Continue working on this assessment to avoid falling behind.";
                    } else {
                        recommendation =
                                "You are currently on track. Continue with the recommended study time.";
                    }

                    String courseName =
                            assessment.getCourse() == null
                                    ? "No Course"
                                    : assessment.getCourse().getCourseName();

                    String assessmentType =
                            assessment.getAssessmentType() == null
                                    ? "OTHER"
                                    : assessment.getAssessmentType().name();

                    return new StudyPlanResponse(
                            assessment.getId(),
                            assessment.getTitle(),
                            courseName,
                            assessmentType,
                            assessment.getDueDate(),
                            daysRemaining,
                            allocatedHours,
                            hoursSpent,
                            remainingHours,
                            weight,
                            riskLevel,
                            recommendedHoursToday,
                            recommendation
                    );
                })
                .sorted(
                        Comparator.comparingInt(plan ->
                                switch (plan.getRiskLevel()) {
                                    case "OVERDUE" -> 0;
                                    case "HIGH" -> 1;
                                    case "MEDIUM" -> 2;
                                    default -> 3;
                                }
                        )
                )
                .collect(Collectors.toList());
    }
}