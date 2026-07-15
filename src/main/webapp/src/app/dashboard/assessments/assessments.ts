import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Assessment } from '../../assessment';

import { AssessmentService } from '../../services/assessment-service';
import { CourseService } from '../../services/course-service';
import { AuthService } from '../../services/auth-service';
import { HelpService } from '../../services/help-service';

@Component({
  selector: 'app-assessments',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatSnackBarModule
  ],
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
  searchQuery: string = '';

  selectedFilter: string = 'titleAsc';

  filteredAssessments: Assessment[] = [];
  showHelpModal = false;

  // ============================
  // NEW ASSESSMENT OBJECT
  // ============================

  newAssessment: Assessment = {

    title: '',

    dueDate: '',

    assessmentType: undefined,

    totalMarks: undefined,

    achievedMarks: undefined,

    percentage: undefined,

    letterGrade: undefined,

    weight: undefined,

    allocatedStudyHours: undefined,

    hoursSpent: undefined,

    completed: null,

    course: {
      id: 0
    },

    student: {
      id: 0
    }

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

  // ============================
  // LOAD COURSES
  // ============================

  loadCourses() {

    this.courseService.getByStudent(this.studentId).subscribe(courses => {

      this.courses = courses;

      this.cdr.detectChanges();

    });

  }

  // ============================
  // LOAD ASSESSMENTS
  // ============================

  loadAssessments() {

    this.assessmentService.getByStudent(this.studentId).subscribe(assessments => {

      this.assessments = assessments.sort((a, b) => {

        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();

      });
	  this.filteredAssessments = [...this.assessments];

      this.cdr.detectChanges();

    });

  }
  addAssessment() {

    // ============================
    // TITLE VALIDATION
    // ============================

    if (!this.newAssessment.title || this.newAssessment.title.trim() === '') {

      this.snackBar.open(
        "Please enter an assessment title.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // DUE DATE
    // ============================

    if (!this.newAssessment.dueDate) {

      this.snackBar.open(
        "Please select a due date.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // COURSE
    // ============================

    if (!this.newAssessment.course.id ||
        this.newAssessment.course.id === 0) {

      this.snackBar.open(
        "Please select a course.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // ASSESSMENT TYPE
    // ============================

    if (!this.newAssessment.assessmentType) {

      this.snackBar.open(
        "Please select an assessment type.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // TOTAL MARKS
    // ============================

    if (this.newAssessment.totalMarks == null) {

      this.snackBar.open(
        "Please enter total marks.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    if (this.newAssessment.totalMarks <= 0) {

      this.snackBar.open(
        "Total marks must be greater than 0.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // ALLOCATED STUDY HOURS
    // ============================

    if (this.newAssessment.allocatedStudyHours == null) {

      this.snackBar.open(
        "Please enter allocated study hours.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    if (this.newAssessment.allocatedStudyHours < 0) {

      this.snackBar.open(
        "Allocated study hours cannot be negative.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // STATUS
    // ============================

    if (this.newAssessment.completed == null) {

      this.snackBar.open(
        "Please select assessment status.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // COMPLETED VALIDATION
    // ============================

    if (this.newAssessment.completed) {

      if (this.newAssessment.achievedMarks == null) {

        this.snackBar.open(
          "Please enter achieved marks.",
          "Close",
          {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['custom-snackbar']
          });

        return;
      }

      if (this.newAssessment.achievedMarks < 0 ||
          this.newAssessment.achievedMarks > this.newAssessment.totalMarks!) {

        this.snackBar.open(
          "Achieved marks cannot exceed total marks.",
          "Close",
          {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['custom-snackbar']
          });

        return;
      }

      if (this.newAssessment.hoursSpent == null) {

        this.snackBar.open(
          "Please enter hours spent.",
          "Close",
          {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['custom-snackbar']
          });

        return;
      }

      if (this.newAssessment.hoursSpent < 0) {

        this.snackBar.open(
          "Hours spent cannot be negative.",
          "Close",
          {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['custom-snackbar']
          });

        return;
      }
    }

    // ============================
    // SAVE
    // ============================
	console.log('Sending assessment:', this.newAssessment);
    this.assessmentService.create(this.newAssessment).subscribe(() => {

      this.snackBar.open(
        "Assessment created successfully!",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      // Reset Form

      this.newAssessment = {

        title: '',

        dueDate: '',

        assessmentType: undefined,

        totalMarks: undefined,

        achievedMarks: undefined,

        allocatedStudyHours: undefined,

        hoursSpent: undefined,

        completed: null,

        course: {
          id: 0
        },

        student: {
          id: this.studentId
        }

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

      assessmentType: a.assessmentType,

      totalMarks: a.totalMarks,

      achievedMarks: a.achievedMarks,

      percentage: a.percentage,

      letterGrade: a.letterGrade,

      weight: a.weight,

      allocatedStudyHours: a.allocatedStudyHours,

      hoursSpent: a.hoursSpent,

      completed: a.completed,

      course: {
        id: a.course.id
      },

      student: {
        id: this.studentId
      }

    };

    this.cdr.detectChanges();

  }
  updateAssessment() {

    if (!this.editingId) return;

    // ============================
    // TITLE
    // ============================

    if (!this.newAssessment.title ||
        this.newAssessment.title.trim() === '') {

      this.snackBar.open(
        "Please enter an assessment title.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // DUE DATE
    // ============================

    if (!this.newAssessment.dueDate) {

      this.snackBar.open(
        "Please select a due date.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // COURSE
    // ============================

    if (!this.newAssessment.course.id ||
        this.newAssessment.course.id === 0) {

      this.snackBar.open(
        "Please select a course.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // TYPE
    // ============================

    if (!this.newAssessment.assessmentType) {

      this.snackBar.open(
        "Please select an assessment type.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // TOTAL MARKS
    // ============================

    if (this.newAssessment.totalMarks == null) {

      this.snackBar.open(
        "Please enter total marks.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // ALLOCATED HOURS
    // ============================

    if (this.newAssessment.allocatedStudyHours == null) {

      this.snackBar.open(
        "Please enter allocated study hours.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // STATUS
    // ============================

    if (this.newAssessment.completed == null) {

      this.snackBar.open(
        "Please choose Completed or Pending.",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      return;
    }

    // ============================
    // COMPLETED VALIDATION
    // ============================

    if (this.newAssessment.completed) {

      if (this.newAssessment.achievedMarks == null) {

        this.snackBar.open(
          "Please enter achieved marks.",
          "Close",
          {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['custom-snackbar']
          });

        return;
      }

      if (this.newAssessment.achievedMarks >
          this.newAssessment.totalMarks!) {

        this.snackBar.open(
          "Achieved marks cannot exceed total marks.",
          "Close",
          {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['custom-snackbar']
          });

        return;
      }

      if (this.newAssessment.hoursSpent == null) {

        this.snackBar.open(
          "Please enter hours spent.",
          "Close",
          {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['custom-snackbar']
          });

        return;
      }

    }

    this.assessmentService
        .update(this.editingId, this.newAssessment)
        .subscribe(() => {

      this.snackBar.open(
        "Assessment updated successfully!",
        "Close",
        {
          duration: 3000,
          verticalPosition: "top",
          panelClass: ['custom-snackbar']
        });

      this.isEditing = false;

      this.editingId = null;

      this.newAssessment = {

        title: '',

        dueDate: '',

        assessmentType: undefined,

        totalMarks: undefined,

        achievedMarks: undefined,

        percentage: undefined,

        letterGrade: undefined,

        weight: undefined,

        allocatedStudyHours: undefined,

        hoursSpent: undefined,

        completed: null,

        course: {
          id: 0
        },

        student: {
          id: this.studentId
        }

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

      assessmentType: undefined,

      totalMarks: undefined,

      achievedMarks: undefined,

      percentage: undefined,

      letterGrade: undefined,

      weight: undefined,

      allocatedStudyHours: undefined,

      hoursSpent: undefined,

      completed: null,

      course: {
        id: 0
      },

      student: {
        id: this.studentId
      }

    };

  }
  deleteAssessment(id: number) {

    this.assessmentService.delete(id).subscribe(() => {

      if (this.isEditing && this.editingId === id) {

        this.isEditing = false;

        this.editingId = null;

        this.newAssessment = {

          title: '',

          dueDate: '',

          assessmentType: undefined,

          totalMarks: undefined,

          achievedMarks: undefined,

          percentage: undefined,

          letterGrade: undefined,

          weight: undefined,

          allocatedStudyHours: undefined,

          hoursSpent: undefined,

          completed: null,

          course: {
            id: 0
          },

          student: {
            id: this.studentId
          }

        };

      }

      this.loadAssessments();

      this.cdr.detectChanges();

    });

  }
  openDeleteConfirm(id: number) {

    this.confirmDeleteId = id;

  }

  closeDeleteConfirm() {

    this.confirmDeleteId = null;

  }

  confirmDelete() {

    if (!this.confirmDeleteId) return;

    this.assessmentService
        .delete(this.confirmDeleteId)
        .subscribe(() => {

          this.snackBar.open(
            "Assessment deleted.",
            "Close",
            {
              duration: 3000,
              verticalPosition: "top",
              panelClass: ['custom-snackbar']
            });

          if (this.isEditing &&
              this.editingId === this.confirmDeleteId) {

            this.isEditing = false;

            this.editingId = null;

            this.newAssessment = {

              title: '',

              dueDate: '',

              assessmentType: undefined,

              totalMarks: undefined,

              achievedMarks: undefined,

              percentage: undefined,

              letterGrade: undefined,

              weight: undefined,

              allocatedStudyHours: undefined,

              hoursSpent: undefined,

              completed: null,

              course: {
                id: 0
              },

              student: {
                id: this.studentId
              }

            };

          }

          this.confirmDeleteId = null;

          this.loadAssessments();

          this.cdr.detectChanges();

        });

  }
  applySearch() {
      this.applyFilter();
  }

  applyFilter() {

      let list = [...this.assessments];

      // Search
      if (this.searchQuery.trim()) {

          const q = this.searchQuery.toLowerCase();

		  list = list.filter(a =>
		      a.title.toLowerCase().includes(q) ||
		      (a.course.courseName ?? "").toLowerCase().includes(q)
		  );
      }

      switch (this.selectedFilter) {

          case 'titleAsc':
              list.sort((a, b) =>
                  a.title.localeCompare(b.title));
              break;

          case 'titleDesc':
              list.sort((a, b) =>
                  b.title.localeCompare(a.title));
              break;

          case 'dateAsc':
              list.sort((a, b) =>
                  new Date(a.dueDate).getTime() -
                  new Date(b.dueDate).getTime());
              break;

          case 'dateDesc':
              list.sort((a, b) =>
                  new Date(b.dueDate).getTime() -
                  new Date(a.dueDate).getTime());
              break;

			  case 'courseAsc':
			      list.sort((a, b) =>
			          (a.course.courseName ?? "")
			              .localeCompare(b.course.courseName ?? "")
			      );
			      break;

			  case 'courseDesc':
			      list.sort((a, b) =>
			          (b.course.courseName ?? "")
			              .localeCompare(a.course.courseName ?? "")
			      );
			      break;
      }

      this.filteredAssessments = list;
  }

  resetFilters() {

      this.searchQuery = '';

      this.selectedFilter = 'titleAsc';

      this.filteredAssessments = [...this.assessments];
  }
  loadHelp(assessment: any) {

    const topic = (assessment.course.courseName ?? '').toLowerCase();

    this.selectedTopic = topic;

    this.helpService.getHelp(topic).subscribe(res => {

      this.selectedHelp = res;

      this.showHelpModal = true;

      this.cdr.detectChanges();

    });

  }
  closeHelpModal() {

    this.showHelpModal = false;

  }
  getIcon(title: string): string {

    if (title.includes('YouTube'))
      return '▶️';

    if (title.includes('Google'))
      return '🔍';

    if (title.includes('Khan'))
      return '📘';

    if (title.includes('Geeks'))
      return '💻';

    return '📚';

  }
  }