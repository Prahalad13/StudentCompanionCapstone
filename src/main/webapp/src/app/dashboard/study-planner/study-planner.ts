import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  AssessmentService
} from '../../services/assessment-service';

import {
  AuthService
} from '../../services/auth-service';

import {
  StudyPlan
} from '../../study-plan';

@Component({
  selector: 'app-study-planner',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './study-planner.html',
  styleUrl: './study-planner.css'
})
export class StudyPlanner implements OnInit {

  studyPlans: StudyPlan[] = [];

  loading = false;

  errorMessage = '';

  // Default maximum study time for one day
  dailyStudyLimit = 6;

  // Stores the student currently using the planner
  currentStudentId: number | null = null;

  // Combined recommended hours from all cards
  totalPlannedToday = 0;

  constructor(
    private assessmentService: AssessmentService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Load the daily limit previously selected by the user
    const savedLimit =
      localStorage.getItem('dailyStudyLimit');

    if (savedLimit) {

      const parsedLimit = Number(savedLimit);

      if (
        !Number.isNaN(parsedLimit) &&
        parsedLimit >= 1 &&
        parsedLimit <= 12
      ) {
        this.dailyStudyLimit = parsedLimit;
      }
    }

    const savedStudent =
      this.authService.getStudent();

    if (savedStudent?.id) {
      this.loadStudyPlan(savedStudent.id);
      return;
    }

    const storedStudentId =
      this.authService.getStudentId();

    if (storedStudentId) {
      this.loadStudyPlan(storedStudentId);
      return;
    }

    this.loadStudentProfile();
  }

  loadStudentProfile(): void {

    this.loading = true;

    this.authService.getMyStudent().subscribe({

      next: (student) => {

        if (!student?.id) {

          this.loading = false;

          this.errorMessage =
            'Create a student profile before using the study planner.';

          this.cdr.detectChanges();
          return;
        }

        this.authService.saveStudent(student);

        this.authService.saveStudentId(
          student.id
        );

        this.loadStudyPlan(student.id);
      },

      error: (error) => {

        console.error(
          'Student profile error:',
          error
        );

        this.loading = false;

        this.errorMessage =
          'Create a student profile before using the study planner.';

        this.cdr.detectChanges();
      }
    });
  }

  loadStudyPlan(studentId: number): void {

    this.currentStudentId = studentId;

    this.loading = true;
    this.errorMessage = '';

    this.assessmentService
      .getStudyPlan(
        studentId,
        this.dailyStudyLimit
      )
      .subscribe({

        next: (plans) => {

          console.log(
            'STUDY PLAN RESPONSE:',
            plans
          );

          this.studyPlans = plans;

          // Add all card recommendations together
          this.totalPlannedToday =
            plans.reduce(
              (
                total: number,
                plan: StudyPlan
              ) =>
                total +
                plan.recommendedHoursToday,
              0
            );

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Study planner error:',
            error
          );

          this.studyPlans = [];

          this.totalPlannedToday = 0;

          this.loading = false;

          this.errorMessage =
            'The Smart Study Planner could not be loaded.';

          this.cdr.detectChanges();
        }
      });
  }

  updateDailyLimit(): void {

    if (
      !this.dailyStudyLimit ||
      this.dailyStudyLimit < 1 ||
      this.dailyStudyLimit > 12
    ) {

      this.errorMessage =
        'Daily study limit must be between 1 and 12 hours.';

      return;
    }

    localStorage.setItem(
      'dailyStudyLimit',
      this.dailyStudyLimit.toString()
    );

    this.errorMessage = '';

    if (this.currentStudentId !== null) {

      this.loadStudyPlan(
        this.currentStudentId
      );
    }
  }

  getProgress(plan: StudyPlan): number {

    if (
      !plan.allocatedHours ||
      plan.allocatedHours <= 0
    ) {
      return 0;
    }

    const percentage =
      (
        plan.hoursSpent /
        plan.allocatedHours
      ) * 100;

    return Math.min(
      Math.round(percentage),
      100
    );
  }

  getDueText(plan: StudyPlan): string {

    if (plan.daysRemaining < 0) {

      return `Overdue by ${Math.abs(
        plan.daysRemaining
      )} day(s)`;
    }

    if (plan.daysRemaining === 0) {
      return 'Due today';
    }

    if (plan.daysRemaining === 1) {
      return 'Due tomorrow';
    }

    return `Due in ${plan.daysRemaining} days`;
  }

  getRiskClass(plan: StudyPlan): string {

    return plan.riskLevel.toLowerCase();
  }
}