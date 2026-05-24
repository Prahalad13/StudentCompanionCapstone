import { CommonModule } from '@angular/common';
import { CourseService } from '../../course-service';
import { AssessmentService } from '../../assessment-service';
import { AuthService } from '../../auth-service';
import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelpService } from '../../help-service';
import { Assessment } from '../../assessment';

@Component({
  selector: 'app-assessments',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './assessments.html',
  styleUrl: './assessments.css',
})
export class Assessments implements OnInit{

  assessments: Assessment[] = [];
  courses: any[] = [];
  studentId!: number;
  selectedHelp: any[] = [];
  selectedTopic: string = '';
  isEditing: boolean = false;
  editingId: number | null = null;


  newAssessment: Assessment = {

    title: '',
    dueDate: '',
    grade: undefined,
    totalMarks: undefined,
    completed: null,
    studyHours: undefined,
    weight: 0,
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
	    grade: undefined,
	    totalMarks: undefined,
	    completed: null,
	    studyHours: undefined,
	    weight: 0,
	    course: { id: 0 },

	    student: { id: this.studentId }
	  };

      this.loadAssessments();
      this.cdr.detectChanges();
    });
  }

  editAssessment(a: Assessment) {
  this.isEditing = true;
  this.editingId = a.id!;

  this.newAssessment = {
    title: a.title,
    dueDate: a.dueDate,
    grade: a.grade,
    totalMarks: a.totalMarks,
    completed: a.completed,
    studyHours: a.studyHours,
    weight: a.weight,
    course: { id: a.course.id },
    student: { id: this.studentId }
  };

  this.cdr.detectChanges();
}

updateAssessment() {
  if (!this.editingId) return;

  this.assessmentService.update(this.editingId, this.newAssessment).subscribe(() => {

    this.isEditing = false;
    this.editingId = null;

    // Reset form
    this.newAssessment = {
      title: '',
      dueDate: '',
      grade: undefined,
      totalMarks: undefined,
      completed: null,
      studyHours: undefined,
      weight: undefined,
      course: { id: 0 },
      student: { id: this.studentId }
    };

    this.loadAssessments();
    this.cdr.detectChanges();
  });
}


cancelEdit() {
  this.isEditing = false;
  this.editingId = null;

  this.newAssessment = {
    title: '',
    dueDate: '',
    grade: undefined,
    totalMarks: undefined,
    completed: null,
    studyHours: undefined,
    weight: undefined,
    course: { id: 0 },
    student: { id: this.studentId }
  };
}


  deleteAssessment(id: number) {
  this.assessmentService.delete(id).subscribe(() => {

    // If the deleted item was being edited, reset the form
    if (this.isEditing && this.editingId === id) {
      this.isEditing = false;
      this.editingId = null;

      this.newAssessment = {
        title: '',
        dueDate: '',
        grade: undefined,
        totalMarks: undefined,
        completed: null,
        studyHours: undefined,
        weight: undefined,
        course: { id: 0 },
        student: { id: this.studentId }
      };
    }

    this.loadAssessments();
    this.cdr.detectChanges();
  });
}


  loadHelp(assessment: any) {

    let topic = assessment.course.courseName.toLowerCase();

    this.selectedTopic = topic;

    this.helpService.getHelp(topic).subscribe(res => {

      console.log("HELP RESPONSE:", res);   
      this.selectedHelp = res;
	  this.cdr.detectChanges();               

      console.log("HELP RESPONSE:", res);   // ✅ ADD THIS
      this.selectedHelp = res;              // ✅ IMPORTANT FIX
      this.cdr.detectChanges();

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
