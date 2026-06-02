import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../services/student-service';
import { CalendarService } from '../services/calendar-service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { AssessmentService } from '../services/assessment-service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  student: any = null;
  studentName: string | null = null;
  email: string | null = null;
  assessments: any[] = [];
  today: Date = new Date();
  // GPA
  gpa: number = 0;

  // COURSE PROGRESS
  courseChartLabels: string[] = [];
  courseChartData: number[] = [];

  // COMPLETION CHART
  completionChartData: number[] = [];

  // WEEKLY PRODUCTIVITY
  weeklyChartLabels: string[] = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
  ];

  weeklyChartData: number[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private studentService: StudentService,
	private calendarService: CalendarService,
	private cdr: ChangeDetectorRef,
	private assessmentService: AssessmentService,
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
		this.loadAnalytics(savedStudent.id);
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
			this.loadAnalytics(res.id);
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
		  //this.generateAnalytics();
	      this.cdr.detectChanges(); 
	    },
	    error: (err) => {
	      console.error(err);
	    }
	  });
	}
	loadAnalytics(studentId: number) {

	  this.assessmentService
	    .getByStudent(studentId)
	    .subscribe((data: any[]) => {

	      this.assessments = data;

	      // =========================
	      // GPA CALCULATION
	      // =========================

	      let totalPercentage = 0;
	      let gradedCount = 0;

	      data.forEach(a => {

	        if (a.grade && a.totalMarks) {

	          const percentage =
	            (a.grade / a.totalMarks) * 100;

	          totalPercentage += percentage;

	          gradedCount++;
	        }
	      });

	      const average =
	        gradedCount > 0
	          ? totalPercentage / gradedCount
	          : 0;

	      // Convert percentage → GPA
	      this.gpa =
	        Number(((average / 100) * 4).toFixed(2));

	      // =========================
	      // COURSE PROGRESS
	      // =========================

	      const courseMap: any = {};

	      data.forEach(a => {

	        const course =
	          a.course?.courseName || 'Unknown';

	        if (!courseMap[course]) {

	          courseMap[course] = {
	            total: 0,
	            completed: 0
	          };
	        }

	        courseMap[course].total++;

	        if (a.completed) {
	          courseMap[course].completed++;
	        }
	      });

	      this.courseChartLabels =
	        Object.keys(courseMap);

	      this.courseChartData =
	        Object.values(courseMap).map((c: any) =>
	          Math.round((c.completed / c.total) * 100)
	        );

	      // =========================
	      // COMPLETION CHART
	      // =========================

	      const completed =
	        data.filter(a => a.completed).length;

	      const pending =
	        data.length - completed;

	      this.completionChartData = [
	        completed,
	        pending
	      ];

	      // =========================
	      // WEEKLY PRODUCTIVITY
	      // =========================

	      const weekly = [0,0,0,0,0,0,0];

	      data.forEach(a => {

	        const hours =
	          a.studyHours || 0;

	        const day =
	          Math.floor(Math.random() * 7);

	        weekly[day] += hours;
	      });

	      this.weeklyChartData = weekly;

	      this.cdr.detectChanges();
	    });
	}
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
}