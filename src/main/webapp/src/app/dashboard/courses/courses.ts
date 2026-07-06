import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course-service';
import { AuthService } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {

  courses: any[] = [];
  studentId!: number;
  isEditing: boolean = false;
  editingId: number | null = null;
  confirmDeleteId: number | null = null;


  newCourse = {
    courseName: '',
    term: '',
    student: { id: 0 }
  };

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef, // to force angular to update the ui immediately
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.studentId = this.authService.getStudentId();
    this.newCourse.student.id = this.studentId;
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getByStudent(this.studentId).subscribe(courses => {
      this.courses = courses;
      this.cdr.detectChanges();
    });
  }

  addCourse() {
    // VALIDATION
    if (!this.newCourse.courseName || this.newCourse.courseName.trim() === '') {
      this.snackBar.open("Please enter a course name.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    if (!this.newCourse.term || this.newCourse.term.trim() === '') {
      this.snackBar.open("Please enter a term.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    this.courseService.create(this.newCourse).subscribe(course => {

      this.snackBar.open("Course created successfully!", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });

      // resets the form
      this.newCourse = {
        courseName: '',
        term: '',
        student: { id: this.studentId }
      };

      // reloads the courses
      this.loadCourses();

      // forces Angular to update the UI immediately
      this.cdr.detectChanges();
    });
  }

  editCourse(c: any) {
    this.isEditing = true;
    this.editingId = c.id;

    this.newCourse = {
      courseName: c.courseName,
      term: c.term,
      student: { id: this.studentId }
    };
  }

  updateCourse() {
    if (!this.editingId) return;

    // VALIDATION
    if (!this.newCourse.courseName || this.newCourse.courseName.trim() === '') {
      this.snackBar.open("Please enter a course name.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    if (!this.newCourse.term || this.newCourse.term.trim() === '') {
      this.snackBar.open("Please enter a term.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });
      return;
    }

    this.courseService.update(this.editingId, this.newCourse).subscribe(() => {

      this.snackBar.open("Course updated successfully!", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });

      this.isEditing = false;
      this.editingId = null;

      this.newCourse = {
        courseName: '',
        term: '',
        student: { id: this.studentId }
      };

      this.loadCourses();
      this.cdr.detectChanges();
    });
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingId = null;

    this.newCourse = {
      courseName: '',
      term: '',
      student: { id: this.studentId }
    };
  }


  deleteCourse(id: number) {
    this.courseService.delete(id).subscribe(() => {

      if (this.isEditing && this.editingId === id) {
        this.isEditing = false;
        this.editingId = null;

        this.newCourse = {
          courseName: '',
          term: '',
          student: { id: this.studentId }
        };
      }

      this.loadCourses();
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

  this.courseService.delete(this.confirmDeleteId).subscribe({
    next: () => {
      this.snackBar.open("Course deleted.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ['custom-snackbar']
      });

      this.confirmDeleteId = null;
      this.loadCourses();
      this.cdr.detectChanges();
    },

    error: (err) => {
      if (err.status === 409) {
        this.snackBar.open(
          "Cannot delete: this course still has assessments.",
          "Close",
          {
            duration: 3000,
            verticalPosition: "top",
            panelClass: ['custom-snackbar']
          }
        );
      }

      this.confirmDeleteId = null; // always close popup
      this.cdr.detectChanges();
    }
  });
}


}
