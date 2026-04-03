/*import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  studentName: string | null = null;
  email: string | null = null;

  constructor(private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // load student object if it exists
    const student = this.authService.getStudent();

    if (student) {
      this.studentName = student.name;
    }

    // always load email from token
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.email = payload.sub; // email stored in JWT
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
*/
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../student-service';
import { CalendarService } from '../calendar-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  student: any = null;
  studentName: string | null = null;
  email: string | null = null;
  assessments: any[] = [];
  today: Date = new Date();

  constructor(
    private authService: AuthService,
    private router: Router,
    private studentService: StudentService,
	private calendarService: CalendarService
  ) {}

  ngOnInit() {

    console.log("Dashboard loaded");

    // ✅ STEP 1: Load from localStorage FIRST (instant UI)
    const savedStudent = this.authService.getStudent();
    if (savedStudent) {
      this.student = savedStudent;
      this.studentName = savedStudent.name;
	  if (savedStudent.id) {
	    this.loadCalendar(savedStudent.id);
	  }
    }

    // ✅ STEP 2: Call backend to refresh latest data
    this.studentService.getMyStudent().subscribe({
      next: (res) => {
        console.log("STUDENT RESPONSE 👉", res);

        if (res) {
          this.student = res;
          this.studentName = res.name;

          // ✅ SAVE for future refresh
          this.authService.saveStudent(res);
		  if (res.id) {
		    this.loadCalendar(res.id);
		  }
        }
      },
      error: (err) => {
        console.log("ERROR 👉", err);
      }
    });

    // ✅ STEP 3: Load email
	const token = this.authService.getToken();
	    if (token) {
	      const payload = JSON.parse(atob(token.split('.')[1]));
	      this.email = payload.sub;
	      console.log("EMAIL 👉", this.email);
	    }
	
  }
  isOverdue(date: string): boolean {
  	  return new Date(date) < new Date();
  	}

  	isUpcoming(date: string): boolean {
  	  return new Date(date) >= new Date();
  	}
  loadCalendar(studentId: number) {
      this.calendarService.getCalendar(studentId).subscribe({
        next: (data) => {
          console.log("CALENDAR 👉", data);
          this.assessments = data;
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
}