import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student } from '../../student';
import { StudentService } from '../../services/student-service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-create-student',
  imports: [FormsModule],
  templateUrl: './create-student.html',
  styleUrl: './create-student.css',
})
export class CreateStudent {

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) { }

  student: Student = {
    name: '',
    age: 0
  };

  submit() {
    this.studentService.create(this.student).subscribe({
      next: (res) => {
        console.log('Student created:', res);

        // Save studentId for later use
        this.authService.saveStudentId(res.id);
        this.authService.saveStudent(res); // saves the full student as well so dashboard can show the name

        this.studentService.onStudentAdded.emit(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert('You already created a student.');
      }
    });
  }
}
