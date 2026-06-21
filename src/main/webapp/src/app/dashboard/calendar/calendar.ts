import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

// services

import { CourseService } from '../../services/course-service';
import { AssessmentService } from '../../services/assessment-service';
import { HealthWellnessService } from '../../services/health-wellness-service';


@Component({
  selector: 'app-calendar',
  imports: [RouterModule, DatePipe],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit {

  // WEEKDAY HEADERS
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  viewMode: 'day' | 'month' | 'year' = 'day';

  months = [
    { name: "Jan", index: 0, isToday: false, isSelected: false },
    { name: "Feb", index: 1, isToday: false, isSelected: false },
    { name: "Mar", index: 2, isToday: false, isSelected: false },
    { name: "Apr", index: 3, isToday: false, isSelected: false },
    { name: "May", index: 4, isToday: false, isSelected: false },
    { name: "Jun", index: 5, isToday: false, isSelected: false },
    { name: "Jul", index: 6, isToday: false, isSelected: false },
    { name: "Aug", index: 7, isToday: false, isSelected: false },
    { name: "Sep", index: 8, isToday: false, isSelected: false },
    { name: "Oct", index: 9, isToday: false, isSelected: false },
    { name: "Nov", index: 10, isToday: false, isSelected: false },
    { name: "Dec", index: 11, isToday: false, isSelected: false }
  ];



  // Year grid (4x3)
  yearGrid: number[] = [];

  selectedDate = new Date();

  today = new Date(); // Today reference

  selectedDayNumber = this.selectedDate.getDate();

  monthViewYear = this.selectedDate.getFullYear();

  userHasSelected = false;

  yearGridStart = 0;

  todayLabel = '';
  selectedLabel = '';


  // DAYS IN MONTH (for the grid)
  daysInMonth: {
    day: number | null;
    date: Date | null;
    isToday: boolean;
    isSelected: boolean;
    isOverflow: boolean;
  }[] = [];


  // RIGHT PANEL DATA
  assessmentsForDate: {
    id: number;
    title: string;
    grade?: string;
    totalMarks?: number;
    studyHours?: number;
    completed?: boolean;
    course?: { courseName: string };
  }[] = [];


  wellnessForDate: {
  id: number;
  mood: string;
  stressLevel: number;
  sleepHours: number;
  energyLevel: string;
  productivity: number;
  notes: string;
}[] = [];

getMoodEmoji(mood: string): string {
  const emojiMap: any = {
    Happy: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif",
    Okay: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f642/512.gif",
    Neutral: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.gif",
    Sad: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif",
    Stressed: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f620/512.gif",
    Tired: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f62a/512.gif"
  };

  return emojiMap[mood] || emojiMap["Okay"];
}

  constructor(
    private assessmentService: AssessmentService,
    private wellnessService: HealthWellnessService,
    private courseService: CourseService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.generateCalendar(this.selectedDate);

    // Mark today's month
    const currentMonth = new Date().getMonth();
    this.months[currentMonth].isToday = true;

    this.updateLabels();
  }

  // GENERATE CALENDAR GRID
  generateCalendar(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // 1. PREVIOUS MONTH DAYS (overflow)
    const startWeekday = firstDay.getDay(); // 0 = Sun
    if (startWeekday > 0) {
      const prevMonthLastDay = new Date(year, month, 0).getDate();

      for (let i = startWeekday - 1; i >= 0; i--) {
        const dayNum = prevMonthLastDay - i;
        const prevDate = new Date(year, month - 1, dayNum);

        days.push({
          day: dayNum,
          date: prevDate,
          isToday: false,
          isSelected: false,
          isOverflow: true
        });
      }
    }

    // 2. CURRENT MONTH DAYS
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const current = new Date(year, month, i);

      days.push({
        day: i,
        date: current,
        isToday: this.isSameDate(current, new Date()),
        isSelected: this.userHasSelected && this.isSameDate(current, this.selectedDate),
        isOverflow: false
      });
    }

    // 3. NEXT MONTH DAYS (overflow)
    const endWeekday = lastDay.getDay(); // 0 = Sun
    if (endWeekday < 6) {
      const nextDays = 6 - endWeekday;

      for (let i = 1; i <= nextDays; i++) {
        const nextDate = new Date(year, month + 1, i);

        days.push({
          day: i,
          date: nextDate,
          isToday: false,
          isSelected: false,
          isOverflow: true
        });
      }
    }

    this.daysInMonth = days;
  }

  handleDayClick(d: any) {
  if (!d.date) return;

  console.log('CLICKED DAY:', d.date, 'overflow?', d.isOverflow);

  if (d.isOverflow) {
    const clickedMonth = d.date.getMonth();
    const currentMonth = this.selectedDate.getMonth();

    if (clickedMonth < currentMonth) {
      this.prevMonth();
    } else if (clickedMonth > currentMonth) {
      this.nextMonth();
    }

    setTimeout(() => {
      this.userHasSelected = true;
      this.selectedDate = d.date;
      this.selectedDayNumber = d.date.getDate();
      console.log('AFTER OVERFLOW SELECT:', this.selectedDate);

      this.generateCalendar(d.date);
      this.loadAssessmentsFor(d.date);
      this.loadWellnessFor(d.date);
      this.updateLabels();
    }, 0);

    return;
  }

  this.userHasSelected = true;
  console.log('NORMAL CLICK, BEFORE selectDate, selectedDate =', this.selectedDate);
  this.selectDate(d.date);
}




  // DATE COMPARISON
  isSameDate(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  updateLabels() {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    this.todayLabel = new Date().toLocaleDateString('en-US', options);
    this.selectedLabel = this.selectedDate.toLocaleDateString('en-US', options);
  }



  prevMonth() {

  if (this.viewMode === 'month') {
    this.clearMonthSelection();
    this.monthViewYear -= 1;
    return;
  }

  if (this.viewMode === 'year') {
    const center = this.yearGrid[6] - 12;
    this.generateYearGrid(center);
    return;
  }

  const year = this.selectedDate.getFullYear();
  const month = this.selectedDate.getMonth();

  const target = new Date(year, month - 1, this.selectedDayNumber);

  if (target.getMonth() !== month - 1 && !(month === 0 && target.getMonth() === 11)) {
    const lastDay = new Date(year, month, 0).getDate();
    this.selectedDate = new Date(year, month - 1, lastDay);
  } else {
    this.selectedDate = target;
  }

  this.selectedDayNumber = this.selectedDate.getDate();

  // ⭐ REGENERATE AFTER updating selectedDate
  this.generateCalendar(this.selectedDate);

  // ⭐ RELOAD DATA FOR THE SELECTED DATE
  this.loadAssessmentsFor(this.selectedDate);
  this.loadWellnessFor(this.selectedDate);

  this.updateLabels();
}



  nextMonth() {

  if (this.viewMode === 'month') {
    this.clearMonthSelection();
    this.monthViewYear += 1;
    return;
  }

  if (this.viewMode === 'year') {
    const center = this.yearGrid[6] + 12;
    this.generateYearGrid(center);
    return;
  }

  const year = this.selectedDate.getFullYear();
  const month = this.selectedDate.getMonth();

  const target = new Date(year, month + 1, this.selectedDayNumber);

  if (target.getMonth() !== month + 1 && !(month === 11 && target.getMonth() === 0)) {
    const lastDay = new Date(year, month + 2, 0).getDate();
    this.selectedDate = new Date(year, month + 1, lastDay);
  } else {
    this.selectedDate = target;
  }

  this.selectedDayNumber = this.selectedDate.getDate();

  // ⭐ REGENERATE AFTER updating selectedDate
  this.generateCalendar(this.selectedDate);

  // ⭐ RELOAD DATA FOR THE SELECTED DATE
  this.loadAssessmentsFor(this.selectedDate);
  this.loadWellnessFor(this.selectedDate);

  this.updateLabels();
}


  // GENERATE YEAR GRID
  generateYearGrid(centerYear: number) {
    this.yearGrid = [];
    const start = centerYear - 6; // 12 years total
    for (let i = 0; i < 12; i++) {
      this.yearGrid.push(start + i);
    }
  }

  // helper function to clear month

  clearMonthSelection() {
    this.months.forEach(m => m.isSelected = false);
  }

  // helper function to clear year

  isYearInRange(year: number): boolean {
    return this.yearGrid.includes(year);
  }


  onYearScroll(direction: 'up' | 'down') {
    const shift = direction === 'up' ? -12 : 12;
    const newCenter = this.yearGrid[6] + shift;
    this.generateYearGrid(newCenter);
  }

  get yearRangeLabel() {
    if (this.yearGrid.length === 0) return '';

    const start = this.yearGrid[0];
    const end = this.yearGrid[this.yearGrid.length - 1];

    return `${start} - ${end}`;
  }



  enterMonthMode() {
    this.viewMode = 'month';

    const selectedMonthIndex = this.selectedDate.getMonth();
    this.months.forEach(m => m.isSelected = false);
    this.months[selectedMonthIndex].isSelected = true;

    this.assessmentsForDate = [];
    this.wellnessForDate = [];

  }

  enterYearMode() {
    const year = this.selectedDate.getFullYear();
    this.generateYearGrid(year);
    this.viewMode = 'year';

    this.assessmentsForDate = [];
    this.wellnessForDate = [];

  }

  selectYear(y: number) {
    // Update the selected date
    this.selectedDate = new Date(y, this.selectedDate.getMonth(), 1);

    // Update the month view year
    this.monthViewYear = y;

    // Clear any previous month selection
    this.clearMonthSelection();

    // Switch to month view
    this.viewMode = 'month';
    this.updateLabels();
  }


  selectMonth(i: number) {
  this.months.forEach(m => m.isSelected = false);
  this.months[i].isSelected = true;

  // ⭐ Preserve the selected day number
  const day = this.selectedDayNumber;

  // ⭐ Create the new date
  let newDate = new Date(this.monthViewYear, i, day);

  // ⭐ If the month doesn't have that day (e.g., Feb 30), use last day of month
  if (newDate.getMonth() !== i) {
    const lastDay = new Date(this.monthViewYear, i + 1, 0).getDate();
    newDate = new Date(this.monthViewYear, i, lastDay);
  }

  this.selectedDate = newDate;
  this.selectedDayNumber = newDate.getDate();

  this.viewMode = 'day';

  // ⭐ Regenerate calendar with correct selected date
  this.generateCalendar(this.selectedDate);

  // ⭐ Reload data for the selected date
  this.loadAssessmentsFor(this.selectedDate);
  this.loadWellnessFor(this.selectedDate);

  this.updateLabels();
}


  // WHEN USER CLICKS A DATE
 selectDate(date: Date) {
  console.log('selectDate CALLED with:', date);

  this.userHasSelected = true;
  this.selectedDate = date;
  this.selectedDayNumber = date.getDate();

  this.generateCalendar(this.selectedDate);

  this.loadAssessmentsFor(date);
  this.loadWellnessFor(date);

  this.updateLabels();
}


  loadAssessmentsFor(date: Date) {
  const formatted = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');

  console.log('LOAD ASSESSMENTS FOR:', formatted);

  this.assessmentService.getByDate(formatted).subscribe({
    next: (data) => {
      console.log('ASSESSMENTS RESPONSE for', formatted, ':', data);
      this.assessmentsForDate = data;
      this.cdr.detectChanges();   // force UI update
    },
    error: (err) => {
      console.log('ASSESSMENTS ERROR for', formatted, ':', err);
      this.assessmentsForDate = [];
      this.cdr.detectChanges();   // force UI update
    }
  });
}

  loadWellnessFor(date: Date) {
  const formatted = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');

  this.wellnessService.getByDate(formatted).subscribe({
    next: (data) => {
      this.wellnessForDate = data;
      this.cdr.detectChanges();   
    },
    error: () => {
      this.wellnessForDate = [];
      this.cdr.detectChanges();
    }
  });
}








}
