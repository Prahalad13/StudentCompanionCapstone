import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course-service';
import { AssessmentService } from '../../services/assessment-service';
import { AuthService } from '../../services/auth-service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HelpService } from '../../services/help-service';
import { Assessment } from '../../assessment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assessments',
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './assessments.html',
  styleUrl: './assessments.css',
})
export class Assessments implements OnInit {

  assessments: Assessment[] = [];
  courses: any[] = [];
  studentId!: number;
  selectedHelp: any[] = [];
  selectedTopic: string = '';
  isEditing: boolean = false;
  editingId: number | null = null;
  confirmDeleteId: number | null = null;


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
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

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

    // FIELD VALIDATION

    if (!this.newAssessment.title || this.newAssessment.title.trim() === '') {
      this.snackBar.open("Please enter an assessment title.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    if (!this.newAssessment.dueDate) {
      this.snackBar.open("Please select a due date.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    if (!this.newAssessment.course.id || this.newAssessment.course.id === 0) {
      this.snackBar.open("Please select a course.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']

      });
      return;
    }


    // NUMERIC VALIDATION

    if (
      this.newAssessment.grade == null ||
      this.newAssessment.totalMarks == null ||
      this.newAssessment.studyHours == null
    ) {
      this.snackBar.open("Please fill in Grade, Total Marks, and Study Hours.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    if (
      this.newAssessment.grade! < 0 || this.newAssessment.grade! > 100 ||
      this.newAssessment.totalMarks! < 0 || this.newAssessment.totalMarks! > 100 ||
      this.newAssessment.studyHours! < 0 || this.newAssessment.studyHours! > 100
    ) {
      this.snackBar.open("Grade, Total Marks, and Study Hours must be between 0 and 100.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    // STATUS VALIDATION

    if (
      this.newAssessment.completed === null ||
      this.newAssessment.completed === undefined ||
      this.newAssessment.completed === ""
    ) {
      this.snackBar.open("Please select a status (Completed or Pending).", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    this.assessmentService.create(this.newAssessment).subscribe(a => {

      // snack bar create successfully alert
      this.snackBar.open("Assessment created successfully!", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });

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

    // FIELD VALIDATION

    if (!this.newAssessment.title || this.newAssessment.title.trim() === '') {
      this.snackBar.open("Please enter an assessment title.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    if (!this.newAssessment.dueDate) {
      this.snackBar.open("Please select a due date.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    if (!this.newAssessment.course.id || this.newAssessment.course.id === 0) {
      this.snackBar.open("Please select a course.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']

      });
      return;
    }


    // NUMERIC VALIDATION

    if (
      this.newAssessment.grade == null ||
      this.newAssessment.totalMarks == null ||
      this.newAssessment.studyHours == null
    ) {
      this.snackBar.open("Please fill in Grade, Total Marks, and Study Hours.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    if (
      this.newAssessment.grade! < 0 || this.newAssessment.grade! > 100 ||
      this.newAssessment.totalMarks! < 0 || this.newAssessment.totalMarks! > 100 ||
      this.newAssessment.studyHours! < 0 || this.newAssessment.studyHours! > 100
    ) {
      this.snackBar.open("Grade, Total Marks, and Study Hours must be between 0 and 100.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    // STATUS VALIDATION

    if (
      this.newAssessment.completed === null ||
      this.newAssessment.completed === undefined ||
      this.newAssessment.completed === ""
    ) {
      this.snackBar.open("Please select a status (Completed or Pending).", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    this.assessmentService.update(this.editingId, this.newAssessment).subscribe(() => {

      // snack bar update successfully alert
      this.snackBar.open("Assessment updated successfully!", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });

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

  // delete box overlay

  openDeleteConfirm(id: number) {
  this.confirmDeleteId = id;
}

closeDeleteConfirm() {
  this.confirmDeleteId = null;
}

confirmDelete() {
  if (!this.confirmDeleteId) return;

  this.assessmentService.delete(this.confirmDeleteId).subscribe(() => {

    this.confirmDeleteId = null;

    // SUCCESS SNACKBAR
    this.snackBar.open("Assessment deleted.", "Close", {
      duration: 3000,
      verticalPosition: "top",
      panelClass: ['custom-snackbar']
    });

    this.confirmDeleteId = null;
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
