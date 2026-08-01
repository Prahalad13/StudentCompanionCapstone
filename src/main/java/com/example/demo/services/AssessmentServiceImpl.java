package com.example.demo.services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
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

        double weight = getWeight(
                assessment.getAssessmentType()
        );

        assessment.setWeight(weight);

        if (Boolean.TRUE.equals(
                assessment.getCompleted())) {

            double percentage = calculatePercentage(
                    assessment.getAchievedMarks(),
                    assessment.getTotalMarks()
            );

            assessment.setPercentage(percentage);

            assessment.setLetterGrade(
                    calculateLetterGrade(percentage)
            );

        } else {

            assessment.setAchievedMarks(null);
            assessment.setPercentage(null);
            assessment.setLetterGrade(null);
        }

        return repo.save(assessment);
    }

    @Override
    public Assessment update(
            Long id,
            Assessment updated) {

        Assessment existing = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment not found"
                        )
                );

        existing.setTitle(
                updated.getTitle()
        );

        existing.setDueDate(
                updated.getDueDate()
        );

        existing.setAssessmentType(
                updated.getAssessmentType()
        );

        existing.setTotalMarks(
                updated.getTotalMarks()
        );

        existing.setCompleted(
                updated.getCompleted()
        );

        existing.setAllocatedStudyHours(
                updated.getAllocatedStudyHours()
        );

        existing.setHoursSpent(
                updated.getHoursSpent()
        );

        existing.setCourse(
                updated.getCourse()
        );

        existing.setStudent(
                updated.getStudent()
        );

        existing.setWeight(
                getWeight(
                        updated.getAssessmentType()
                )
        );

        if (Boolean.TRUE.equals(
                updated.getCompleted())) {

            existing.setAchievedMarks(
                    updated.getAchievedMarks()
            );

            double percentage = calculatePercentage(
                    updated.getAchievedMarks(),
                    updated.getTotalMarks()
            );

            existing.setPercentage(percentage);

            existing.setLetterGrade(
                    calculateLetterGrade(percentage)
            );

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
    public List<Assessment> getByDate(
            LocalDate date) {

        return repo.findByDueDate(date);
    }

    private double getWeight(
            AssessmentType type) {

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

    private String calculateLetterGrade(
            double percentage) {

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
    public AssessmentCompletionDTO
            getAssessmentCompletion(
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
                    || assessment.getCourse()
                        .getTerm() == null
                    || !assessment.getCourse()
                        .getTerm()
                        .equals(term)) {

                continue;
            }

            if (!assessment.getCourse()
                    .getCourseName()
                    .equals(courseName)) {

                continue;
            }

            if (Boolean.TRUE.equals(
                    assessment.getCompleted())) {

                completed++;

            } else if (
                    assessment.getDueDate() != null
                    && assessment.getDueDate()
                        .isBefore(today)) {

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
    public void addStudyHours(
            AssessmentStudyRequest request) {

        Assessment assessment = repo
                .findById(
                        request.getAssessmentId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Assessment not found"
                        )
                );

        int currentHours =
                assessment.getHoursSpent() == null
                        ? 0
                        : assessment.getHoursSpent();

        int additionalHours =
                Math.max(
                        request.getHours(),
                        0
                );

        assessment.setHoursSpent(
                currentHours + additionalHours
        );

        repo.save(assessment);
    }

    @Override
    public List<StudyPlanResponse> getStudyPlan(
            Long studentId,
            int dailyLimit) {

        LocalDate today = LocalDate.now();

        List<StudyPlanResponse> plans = repo
                .findByStudentIdOrderByDueDateAsc(
                        studentId
                )
                .stream()

                // Remove completed assessments
                .filter(assessment ->
                        !Boolean.TRUE.equals(
                                assessment.getCompleted()
                        )
                )

                // Convert each Assessment into a
                // StudyPlanResponse
                .map(assessment -> {

                    int allocatedHours =
                            assessment
                                .getAllocatedStudyHours()
                                    == null
                            ? 0
                            : assessment
                                .getAllocatedStudyHours();

                    int hoursSpent =
                            assessment.getHoursSpent()
                                    == null
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

                    double requiredHoursPerDay =
                            calculateRequiredHoursPerDay(
                                    remainingHours,
                                    daysRemaining
                            );

                    int progressPercentage =
                            calculateStudyProgress(
                                    allocatedHours,
                                    hoursSpent
                            );

                    List<String> riskFactors =
                            new ArrayList<>();

                    int riskScore = 0;

                    riskScore += calculateDeadlineRisk(
                            daysRemaining,
                            riskFactors
                    );

                    riskScore += calculateWorkloadRisk(
                            requiredHoursPerDay,
                            remainingHours,
                            riskFactors
                    );

                    riskScore += calculateWeightRisk(
                            weight,
                            riskFactors
                    );

                    riskScore += calculateTypeRisk(
                            assessment.getAssessmentType(),
                            riskFactors
                    );

                    riskScore += calculateProgressRisk(
                            allocatedHours,
                            progressPercentage,
                            riskFactors
                    );

                    riskScore += calculateMarksRisk(
                            assessment.getTotalMarks(),
                            riskFactors
                    );

                    riskScore = Math.min(
                            riskScore,
                            100
                    );

                    String riskLevel =
                            determineRiskLevel(
                                    riskScore,
                                    daysRemaining
                            );

                    int recommendedHoursToday =
                            calculateRecommendedHours(
                                    remainingHours,
                                    daysRemaining
                            );

                    String recommendation =
                            buildRecommendation(
                                    daysRemaining,
                                    remainingHours,
                                    requiredHoursPerDay,
                                    recommendedHoursToday,
                                    weight,
                                    progressPercentage,
                                    riskLevel
                            );

                    String courseName =
                            assessment.getCourse() == null
                                    ? "No Course"
                                    : assessment.getCourse()
                                        .getCourseName();

                    String assessmentType =
                            assessment
                                .getAssessmentType() == null
                                    ? "Not Specified"
                                    : assessment
                                        .getAssessmentType()
                                        .name();

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
                            roundToOneDecimal(
                                    requiredHoursPerDay
                            ),
                            progressPercentage,
                            weight,
                            riskScore,
                            riskLevel,
                            recommendedHoursToday,
                            riskFactors,
                            recommendation
                    );
                })

                // Highest risk appears first
                .sorted(
                        Comparator
                            .comparingInt(
                                StudyPlanResponse
                                    ::getRiskScore
                            )
                            .reversed()
                            .thenComparing(
                                StudyPlanResponse
                                    ::getDueDate
                            )
                )

                .collect(Collectors.toList());

        // Keep the daily limit between 1 and 12
        int safeDailyLimit = Math.max(
                1,
                Math.min(dailyLimit, 12)
        );

        // Distribute the daily hours after sorting
        distributeDailyHours(
                plans,
                safeDailyLimit
        );

        return plans;
    }

    /**
     * Distributes the student's daily study limit
     * across assessments from highest to lowest risk.
     */
    private void distributeDailyHours(
            List<StudyPlanResponse> plans,
            int dailyLimit) {

        int availableHours = dailyLimit;

        for (StudyPlanResponse plan : plans) {

            int calculatedHours =
                    plan.getRecommendedHoursToday();

            if (availableHours <= 0) {

                plan.setRecommendedHoursToday(0);

                plan.setRecommendation(
                        "Your daily study limit has already "
                        + "been assigned to higher-priority "
                        + "assessments. Continue with this "
                        + "assessment after completing today's "
                        + "higher-priority work."
                );

                continue;
            }

            int assignedHours = Math.min(
                    calculatedHours,
                    availableHours
            );

            plan.setRecommendedHoursToday(
                    assignedHours
            );

            availableHours -= assignedHours;

            String updatedRecommendation =
                    buildRecommendation(
                            plan.getDaysRemaining(),
                            plan.getRemainingHours(),
                            plan.getRequiredHoursPerDay(),
                            assignedHours,
                            plan.getWeight(),
                            plan.getProgressPercentage(),
                            plan.getRiskLevel()
                    );

            if (assignedHours < calculatedHours) {

                updatedRecommendation +=
                        " The full calculated requirement was "
                        + calculatedHours
                        + " hour(s), but today's plan assigns "
                        + assignedHours
                        + " hour(s) because of your daily limit.";
            }

            plan.setRecommendation(
                    updatedRecommendation
            );
        }
    }

    private double calculateRequiredHoursPerDay(
            int remainingHours,
            long daysRemaining) {

        if (remainingHours <= 0) {
            return 0.0;
        }

        if (daysRemaining <= 0) {
            return remainingHours;
        }

        return (double) remainingHours
                / daysRemaining;
    }

    private int calculateStudyProgress(
            int allocatedHours,
            int hoursSpent) {

        if (allocatedHours <= 0) {
            return 0;
        }

        double progress =
                ((double) hoursSpent
                        / allocatedHours) * 100;

        return (int) Math.min(
                Math.round(progress),
                100
        );
    }

    private int calculateDeadlineRisk(
            long daysRemaining,
            List<String> factors) {

        if (daysRemaining < 0) {

            factors.add(
                    "The deadline passed "
                    + Math.abs(daysRemaining)
                    + " day(s) ago."
            );

            return 40;
        }

        if (daysRemaining == 0) {

            factors.add(
                    "This assessment is due today."
            );

            return 40;
        }

        if (daysRemaining == 1) {

            factors.add(
                    "Only 1 day remains before the deadline."
            );

            return 36;
        }

        if (daysRemaining == 2) {

            factors.add(
                    "Only 2 days remain before the deadline."
            );

            return 32;
        }

        if (daysRemaining <= 3) {

            factors.add(
                    "The deadline is less than 4 days away."
            );

            return 28;
        }

        if (daysRemaining <= 7) {

            factors.add(
                    "The assessment is due within one week."
            );

            return 20;
        }

        if (daysRemaining <= 14) {

            factors.add(
                    "The assessment is due within two weeks."
            );

            return 10;
        }

        return 5;
    }

    private int calculateWorkloadRisk(
            double requiredHoursPerDay,
            int remainingHours,
            List<String> factors) {

        if (remainingHours <= 0) {
            return 0;
        }

        if (requiredHoursPerDay >= 4) {

            factors.add(
                    "The remaining workload requires about "
                    + roundToOneDecimal(
                            requiredHoursPerDay
                    )
                    + " study hours per day."
            );

            return 30;
        }

        if (requiredHoursPerDay >= 3) {

            factors.add(
                    "Approximately "
                    + roundToOneDecimal(
                            requiredHoursPerDay
                    )
                    + " study hours are required each day."
            );

            return 24;
        }

        if (requiredHoursPerDay >= 2) {

            factors.add(
                    "The workload requires at least "
                    + roundToOneDecimal(
                            requiredHoursPerDay
                    )
                    + " study hours per day."
            );

            return 18;
        }

        if (requiredHoursPerDay >= 1) {

            factors.add(
                    remainingHours
                    + " planned study hour(s) remain."
            );

            return 10;
        }

        factors.add(
                remainingHours
                + " planned study hour(s) remain."
        );

        return 5;
    }

    private int calculateWeightRisk(
            double weight,
            List<String> factors) {

        if (weight >= 30) {

            factors.add(
                    "This assessment is worth "
                    + roundToOneDecimal(weight)
                    + "% of the course grade."
            );

            return 15;
        }

        if (weight >= 20) {

            factors.add(
                    "This assessment has a significant "
                    + roundToOneDecimal(weight)
                    + "% course weight."
            );

            return 10;
        }

        if (weight >= 10) {

            factors.add(
                    "This assessment contributes "
                    + roundToOneDecimal(weight)
                    + "% to the course grade."
            );

            return 5;
        }

        return weight > 0 ? 2 : 0;
    }

    private int calculateTypeRisk(
            AssessmentType type,
            List<String> factors) {

        if (type == null) {
            return 0;
        }

        return switch (type) {

            case FINAL -> {

                factors.add(
                        "This is a final assessment."
                );

                yield 10;
            }

            case MIDTERM -> {

                factors.add(
                        "This is a midterm assessment."
                );

                yield 8;
            }

            case PROJECT -> {

                factors.add(
                        "This is a project assessment."
                );

                yield 6;
            }

            case ASSIGNMENT -> {

                factors.add(
                        "This is an assignment."
                );

                yield 4;
            }

            case QUIZ -> {

                factors.add(
                        "This is a quiz."
                );

                yield 2;
            }
        };
    }

    private int calculateProgressRisk(
            int allocatedHours,
            int progressPercentage,
            List<String> factors) {

        if (allocatedHours <= 0) {

            factors.add(
                    "No planned study hours were entered."
            );

            return 5;
        }

        if (progressPercentage == 0) {

            factors.add(
                    "None of the planned study time "
                    + "has been completed."
            );

            return 10;
        }

        if (progressPercentage < 25) {

            factors.add(
                    "Only "
                    + progressPercentage
                    + "% of the planned study time "
                    + "has been completed."
            );

            return 8;
        }

        if (progressPercentage < 50) {

            factors.add(
                    "Less than half of the planned "
                    + "study time is complete."
            );

            return 5;
        }

        if (progressPercentage < 75) {

            factors.add(
                    progressPercentage
                    + "% of the planned study time "
                    + "has been completed."
            );

            return 2;
        }

        return 0;
    }

    private int calculateMarksRisk(
            Double totalMarks,
            List<String> factors) {

        if (totalMarks == null
                || totalMarks <= 0) {

            return 0;
        }

        if (totalMarks >= 100) {

            factors.add(
                    "This is a large assessment worth "
                    + roundToOneDecimal(totalMarks)
                    + " total marks."
            );

            return 5;
        }

        if (totalMarks >= 50) {

            factors.add(
                    "This assessment is worth "
                    + roundToOneDecimal(totalMarks)
                    + " total marks."
            );

            return 3;
        }

        return 1;
    }

    private String determineRiskLevel(
            int riskScore,
            long daysRemaining) {

        if (daysRemaining < 0) {
            return "OVERDUE";
        }

        if (riskScore >= 65) {
            return "HIGH";
        }

        if (riskScore >= 35) {
            return "MEDIUM";
        }

        return "LOW";
    }

    private int calculateRecommendedHours(
            int remainingHours,
            long daysRemaining) {

        if (remainingHours <= 0) {
            return 0;
        }

        if (daysRemaining <= 0) {
            return remainingHours;
        }

        int recommended =
                (int) Math.ceil(
                        (double) remainingHours
                                / daysRemaining
                );

        return Math.min(
                remainingHours,
                Math.max(recommended, 1)
        );
    }

    private String buildRecommendation(
            long daysRemaining,
            int remainingHours,
            double requiredHoursPerDay,
            int recommendedHoursToday,
            double weight,
            int progressPercentage,
            String riskLevel) {

        if (remainingHours == 0) {

            return "All planned study hours are complete. "
                    + "Review the material before the deadline.";
        }

        if (daysRemaining < 0) {

            return "This assessment is overdue. Complete the "
                    + remainingHours
                    + " remaining study hour(s) as soon as possible.";
        }

        StringBuilder recommendation =
                new StringBuilder();

        recommendation.append(
                "Study "
                + recommendedHoursToday
                + " hour(s) today"
        );

        if (requiredHoursPerDay >= 3) {

            recommendation.append(
                    " to manage the heavy remaining workload"
            );

        } else if (daysRemaining <= 2) {

            recommendation.append(
                    " because the deadline is very close"
            );

        } else {

            recommendation.append(
                    " to remain on schedule"
            );
        }

        recommendation.append(". ");

        if (weight >= 30) {

            recommendation.append(
                    "This assessment has a high course weight, "
                    + "so it should receive extra attention. "
            );
        }

        if (progressPercentage == 0) {

            recommendation.append(
                    "Begin the planned study work today. "
            );

        } else if (progressPercentage < 50) {

            recommendation.append(
                    "Less than half of the planned study work "
                    + "has been completed. "
            );
        }

        if ("HIGH".equals(riskLevel)) {

            recommendation.append(
                    "Prioritize it before lower-risk assessments."
            );

        } else if ("MEDIUM".equals(riskLevel)) {

            recommendation.append(
                    "Continue making steady progress to prevent "
                    + "the risk from increasing."
            );

        } else {

            recommendation.append(
                    "You are currently on track."
            );
        }

        return recommendation
                .toString()
                .trim();
    }

    private double roundToOneDecimal(
            double value) {

        return Math.round(value * 10.0) / 10.0;
    }
}