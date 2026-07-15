package com.example.demo.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.Assessment;
import com.example.demo.domain.AssessmentType;
import com.example.demo.dto.AssessmentCompletionDTO;
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

        System.out.println("\n========== SAVING ASSESSMENT ==========");

        System.out.println("Title: " + assessment.getTitle());
        System.out.println("Assessment Type: " + assessment.getAssessmentType());
        System.out.println("Completed: " + assessment.getCompleted());
        System.out.println("Total Marks: " + assessment.getTotalMarks());
        System.out.println("Achieved Marks: " + assessment.getAchievedMarks());
        System.out.println("Allocated Study Hours: " + assessment.getAllocatedStudyHours());
        System.out.println("Hours Spent: " + assessment.getHoursSpent());

        // Calculate Weight
        double weight = getWeight(assessment.getAssessmentType());

        System.out.println("Calculated Weight: " + weight);

        assessment.setWeight(weight);

        if (Boolean.TRUE.equals(assessment.getCompleted())) {

            double percentage = calculatePercentage(
                    assessment.getAchievedMarks(),
                    assessment.getTotalMarks());

            System.out.println("Calculated Percentage: " + percentage);

            assessment.setPercentage(percentage);

            String grade = calculateLetterGrade(percentage);

            System.out.println("Calculated Letter Grade: " + grade);

            assessment.setLetterGrade(grade);

        } else {

            System.out.println("Assessment is Pending");

            assessment.setAchievedMarks(null);
            assessment.setHoursSpent(0);
            assessment.setPercentage(null);
            assessment.setLetterGrade(null);
        }

        Assessment savedAssessment = repo.save(assessment);

        System.out.println("========== SAVED TO DATABASE ==========");
        System.out.println("ID: " + savedAssessment.getId());
        System.out.println("Weight: " + savedAssessment.getWeight());
        System.out.println("Percentage: " + savedAssessment.getPercentage());
        System.out.println("Letter Grade: " + savedAssessment.getLetterGrade());
        System.out.println("=======================================\n");

        return savedAssessment;
    }

    @Override
    public Assessment update(Long id, Assessment updated) {

        Assessment existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        existing.setTitle(updated.getTitle());
        existing.setDueDate(updated.getDueDate());

        existing.setAssessmentType(updated.getAssessmentType());

        existing.setTotalMarks(updated.getTotalMarks());
        existing.setAchievedMarks(updated.getAchievedMarks());

        existing.setCompleted(updated.getCompleted());

        existing.setAllocatedStudyHours(updated.getAllocatedStudyHours());
        existing.setHoursSpent(updated.getHoursSpent());

        existing.setCourse(updated.getCourse());
        existing.setStudent(updated.getStudent());
        // calculate
        existing.setWeight(
                getWeight(updated.getAssessmentType()));

        if (Boolean.TRUE.equals(updated.getCompleted())) {

            existing.setAchievedMarks(updated.getAchievedMarks());

            existing.setHoursSpent(updated.getHoursSpent());

            double percentage = calculatePercentage(
                    updated.getAchievedMarks(),
                    updated.getTotalMarks());

            existing.setPercentage(percentage);

            existing.setLetterGrade(
                    calculateLetterGrade(percentage));

        } else {

            existing.setAchievedMarks(null);

            existing.setHoursSpent(0);

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

    /**
     * Returns the weight for each assessment type.
     */
    private double getWeight(AssessmentType type) {

        if (type == null) {
            return 0.0;
        }

        switch (type) {

            case QUIZ:
                return 10.0;

            case ASSIGNMENT:
                return 15.0;

            case MIDTERM:
                return 30.0;

            case FINAL:
                return 30.0;

            case PROJECT:
                return 15.0;

            default:
                return 0.0;
        }
    }

    /**
     * Calculates the assessment percentage.
     */
    private double calculatePercentage(Double achievedMarks,
                                       Double totalMarks) {

        if (achievedMarks == null ||
            totalMarks == null ||
            totalMarks <= 0) {

            return 0.0;
        }

        return (achievedMarks / totalMarks) * 100.0;
    }

    /**
     * Converts a percentage into a letter grade.
     */
    private String calculateLetterGrade(double percentage) {

        if (percentage >= 90)
            return "A+";

        if (percentage >= 80)
            return "A";

        if (percentage >= 70)
            return "B";

        if (percentage >= 60)
            return "C";

        if (percentage >= 50)
            return "D";

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
            // Skip different terms
            if (assessment.getCourse() == null
                    || assessment.getCourse().getTerm() == null
                    || !assessment.getCourse().getTerm().equals(term)) {
                continue;
            }
            // Skip different courses
            if (!assessment.getCourse().getCourseName().equals(courseName)) {
                continue;
            }
            // Completed
            if (Boolean.TRUE.equals(assessment.getCompleted())) {
                completed++;
            }
            // Overdue
            else if (assessment.getDueDate() != null
                    && assessment.getDueDate().isBefore(today)) {
                overdue++;
            }
            // Upcoming
            else {
                upcoming++;
            }
        }
        return new AssessmentCompletionDTO(
                completed,
                upcoming,
                overdue
        );
    }

}