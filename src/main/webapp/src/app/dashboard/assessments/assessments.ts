import { CommonModule } from '@angular/common';
import { CourseService } from '../../course-service';
import { AssessmentService } from '../../assessment-service';
import { AuthService } from '../../auth-service';
import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelpService } from '../../help-service';


@Component({
  selector: 'app-assessments',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './assessments.html',
  styleUrl: './assessments.css',
})
export class Assessments implements OnInit{

  assessments: any[] = [];
  courses: any[] = [];
  studentId!: number;
  selectedHelp: any[] = [];
  selectedTopic: string = '';

  newAssessment = {
    title: '',
    dueDate: '',
    course: { id: 0 },
    student: { id: 0 }
  };

  constructor(
    private assessmentService: AssessmentService,
    private courseService: CourseService,
    private authService: AuthService,
	private helpService: HelpService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.studentId = this.authService.getStudentId();
    this.newAssessment.student.id = this.studentId;

    this.loadCourses();
    this.loadAssessments();
  }

  loadCourses() {
    this.courseService.getByStudent(this.studentId).subscribe(courses => {
      this.courses = courses;
      this.cdr.detectChanges();
    });
  }

  loadAssessments() {
    this.assessmentService.getByStudent(this.studentId).subscribe(assessments => {
      this.assessments = assessments;
      this.cdr.detectChanges();
    });
  }

  addAssessment() {
    this.assessmentService.create(this.newAssessment).subscribe(a => {

      // Reset form
      this.newAssessment = {
        title: '',
        dueDate: '',
        course: { id: 0 },
        student: { id: this.studentId }
      };

      this.loadAssessments();
      this.cdr.detectChanges();
    });
  }

  deleteAssessment(id: number) {

    this.assessmentService.delete(id).subscribe(() => {
      this.loadAssessments();
      this.cdr.detectChanges();
    });
  }
  loadHelp(assessment: any) {

    let topic = assessment.course.courseName.toLowerCase();

    this.selectedTopic = topic;

    this.helpService.getHelp(topic).subscribe(res => {
      console.log("HELP RESPONSE:", res);   // ✅ ADD THIS
      this.selectedHelp = res;              // ✅ IMPORTANT FIX
    });
  }
  getIcon(title: string): string {
    if (title.includes('YouTube')) return '▶️';
    if (title.includes('Google')) return '🔍';
    if (title.includes('Khan')) return '📘';
    if (title.includes('Geeks')) return '💻';
    return '📚';
  }
}
