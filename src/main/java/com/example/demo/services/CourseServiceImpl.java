package com.example.demo.services;

import java.util.List;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

import com.example.demo.dto.TermPerformanceDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.domain.Assessment;
import com.example.demo.domain.Course;
import com.example.demo.repositories.AssessmentRepository;
import com.example.demo.repositories.CourseRepository;
import com.example.demo.dto.CoursePerformanceDTO;
import com.example.demo.dto.CourseProgressDTO;
@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository repo;
    
    @Autowired
    private AssessmentRepository assessmentRepository;

    public List<Course> findAll() {
        return repo.findAll();
    }
    
    public List<Course> findByStudentId(Long studentId) {  
        return repo.findByStudentId(studentId);
    }

    public Course save(Course course) {
        return repo.save(course);
    }
    
    @Override
    public Course update(Long id, Course course) {
        course.setId(id);
        return repo.save(course);
    }


    public void delete(Long id) {
        repo.deleteById(id);
    }
    
    @Override
    public boolean hasAssessments(Long courseId) {
        return assessmentRepository.existsByCourseId(courseId);
    }
    @Override
    public double calculateCoursePercentage(Long courseId) {

        List<Assessment> assessments =
                assessmentRepository.findByCourseId(courseId);

        double weightedMarks = 0;
        double totalWeight = 0;

        for (Assessment assessment : assessments) {

            if (Boolean.TRUE.equals(assessment.getCompleted())) {

                if (assessment.getPercentage() != null &&
                    assessment.getWeight() != null) {

                    weightedMarks +=
                            assessment.getPercentage()
                            * assessment.getWeight();

                    totalWeight +=
                            assessment.getWeight();
                }
            }
        }

        if (totalWeight == 0) {
            return 0;
        }

        return weightedMarks / totalWeight;
    }
    @Override
    public String calculateCourseLetterGrade(Long courseId) {

        double percentage = calculateCoursePercentage(courseId);

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
    public List<TermPerformanceDTO> getTermPerformance(Long studentId) {

        List<Course> courses = repo.findByStudentId(studentId);

        Map<String, TermPerformanceDTO> termMap = new LinkedHashMap<>();

        for (Course course : courses) {

            String term = course.getTerm();

            // Create DTO for term if it doesn't exist
            TermPerformanceDTO dto = termMap.get(term);

            if (dto == null) {

                dto = new TermPerformanceDTO();

                dto.setTerm(term);
                dto.setAveragePercentage(0.0);
                dto.setLetterGrade("");
                dto.setTotalCourses(0);
                dto.setCompletedCourses(0);
                dto.setInProgressCourses(0);
                dto.setCompleted(false);

                termMap.put(term, dto);
            }

            // Count course
            dto.setTotalCourses(dto.getTotalCourses() + 1);

            // Add course percentage
            double percentage = calculateCoursePercentage(course.getId());

            dto.setAveragePercentage(
                    dto.getAveragePercentage() + percentage);

            // Determine whether the course is complete
            if (isCourseCompleted(course.getId())) {

                dto.setCompletedCourses(
                        dto.getCompletedCourses() + 1);

            } else {

                dto.setInProgressCourses(
                        dto.getInProgressCourses() + 1);
            }
        }

        // Final calculations
        List<TermPerformanceDTO> result = new ArrayList<>();

        for (TermPerformanceDTO dto : termMap.values()) {

            double average = 0.0;

            if (dto.getTotalCourses() > 0) {

                average =
                        dto.getAveragePercentage()
                        / dto.getTotalCourses();
            }

            dto.setAveragePercentage(average);

            dto.setLetterGrade(getLetterGrade(average));

            dto.setCompleted(
                    dto.getCompletedCourses()
                    == dto.getTotalCourses());

            result.add(dto);
        }

        return result;
    }
    private boolean isCourseCompleted(Long courseId) {

        List<Assessment> assessments =
                assessmentRepository.findByCourseId(courseId);

        if (assessments.isEmpty()) {
            return false;
        }

        for (Assessment assessment : assessments) {

            if (!Boolean.TRUE.equals(assessment.getCompleted())) {
                return false;
            }
        }

        return true;
    }
    private String getLetterGrade(double percentage) {

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
    public List<CoursePerformanceDTO> getCoursesForTerm(Long studentId,
                                                        String term) {

        List<Course> courses = repo.findByStudentId(studentId);

        List<CoursePerformanceDTO> result = new ArrayList<>();

        for (Course course : courses) {

            if (!course.getTerm().equalsIgnoreCase(term)) {
                continue;
            }

            CoursePerformanceDTO dto = new CoursePerformanceDTO();

            dto.setCourseName(course.getCourseName());

            dto.setTerm(course.getTerm());

            dto.setPercentage(
                    calculateCoursePercentage(course.getId()));

            dto.setLetterGrade(
                    calculateCourseLetterGrade(course.getId()));

            dto.setCompleted(
                    isCourseCompleted(course.getId()));

            result.add(dto);
        }

        return result;
    }
    @Override
    public List<CourseProgressDTO> getCourseProgress(
            Long studentId,
            String term,
            String courseName) {

        List<Course> courses =
                repo.findByStudentId(studentId);

        Course selectedCourse = courses.stream()
                .filter(c ->
                        c.getTerm().equals(term) &&
                        c.getCourseName().equals(courseName))
                .findFirst()
                .orElse(null);

        if (selectedCourse == null) {
            return List.of();
        }

        List<Assessment> assessments =
                assessmentRepository.findByCourseId(selectedCourse.getId());

        List<CourseProgressDTO> result = new ArrayList<>();

        for (Assessment assessment : assessments) {

            CourseProgressDTO dto =
                    new CourseProgressDTO();

            dto.setAssessmentName(assessment.getTitle());
            dto.setPercentage(assessment.getPercentage());
            dto.setCompleted(assessment.getCompleted());
            dto.setAllocatedStudyHours(assessment.getAllocatedStudyHours());
            dto.setHoursSpent(assessment.getHoursSpent());

            result.add(dto);
        }

        return result;
    }
    
}