import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../course-service';
import { AuthService } from '../../auth-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses implements OnInit {

  courses: any[] = [];
  studentId!: number;
  isEditing: boolean = false;
  editingId: number | null = null;


  newCourse = {
    courseName: '',
    term: '',
    student: { id: 0 }
  };

  constructor(
    private courseService: CourseService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // to force angular to update the ui immediately
  ) {}

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
  this.courseService.create(this.newCourse).subscribe(course => {

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

  this.courseService.update(this.editingId, this.newCourse).subscribe(() => {

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

}
