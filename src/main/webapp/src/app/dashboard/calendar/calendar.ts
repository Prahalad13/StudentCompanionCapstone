import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';


@Component({
  selector: 'app-calendar',
  imports: [RouterModule, DatePipe, SlicePipe],
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
  
  userHasSelected = false;

  yearGridStart = 0;

  


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
    course?: { courseName: string };
  }[] = [];

  wellnessForDate: {
    id: number;
    type: string;
    notes: string;
  }[] = [];

  ngOnInit() {
    this.generateCalendar(this.selectedDate);

    // Mark today's month
  const currentMonth = new Date().getMonth();
  this.months[currentMonth].isToday = true;
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



  // WHEN USER CLICKS A DATE
  selectDate(date: Date) {
    this.userHasSelected = true;
    this.selectedDate = date;
    this.selectedDayNumber = date.getDate();
    this.generateCalendar(date);
  }


  handleDayClick(d: any) {
    if (!d.date) return;

    if (d.isOverflow) {
      // If it's from previous month
      if (d.date.getMonth() < this.selectedDate.getMonth()) {
        this.prevMonth();
      }
      // If it's from next month
      else if (d.date.getMonth() > this.selectedDate.getMonth()) {
        this.nextMonth();
      }
    }

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

 
prevMonth() {
  const year = this.selectedDate.getFullYear();
  const month = this.selectedDate.getMonth();
  this.userHasSelected = false;

  const target = new Date(year, month - 1, this.selectedDayNumber);

  if (target.getMonth() !== month - 1 && !(month === 0 && target.getMonth() === 11)) {
    const lastDay = new Date(year, month, 0).getDate();
    this.selectedDate = new Date(year, month - 1, lastDay);
  } else {
    this.selectedDate = target;
  }

  this.selectedDayNumber = this.selectedDate.getDate();
  this.generateCalendar(this.selectedDate);
}


nextMonth() {
  const year = this.selectedDate.getFullYear();
  const month = this.selectedDate.getMonth();
  this.userHasSelected = false;

  const target = new Date(year, month + 1, this.selectedDayNumber);

  if (target.getMonth() !== month + 1 && !(month === 11 && target.getMonth() === 0)) {
    const lastDay = new Date(year, month + 2, 0).getDate();
    this.selectedDate = new Date(year, month + 1, lastDay);
  } else {
    this.selectedDate = target;
  }

  this.selectedDayNumber = this.selectedDate.getDate();
  this.generateCalendar(this.selectedDate);
}




  // GENERATE YEAR GRID
  generateYearGrid(centerYear: number) {
  this.yearGrid = [];
  const start = centerYear - 6; // 12 years total
  for (let i = 0; i < 12; i++) {
    this.yearGrid.push(start + i);
  }
}

onYearScroll(direction: 'up' | 'down') {
  const shift = direction === 'up' ? -12 : 12;
  const newCenter = this.yearGrid[6] + shift;
  this.generateYearGrid(newCenter);
}

enterMonthMode() {
  this.viewMode = 'month';
}

enterYearMode() {
  this.viewMode = 'year';
  this.generateYearGrid(this.selectedDate.getFullYear());
}

selectYear(y: number) {
  this.selectedDate = new Date(y, this.selectedDate.getMonth(), 1);
  this.viewMode = 'month';
}

selectMonth(i: number) {
  this.months.forEach(m => m.isSelected = false);
  this.months[i].isSelected = true;

  this.selectedDate = new Date(this.selectedDate.getFullYear(), i, 1);
  this.viewMode = 'day';
  this.generateCalendar(this.selectedDate);
}








}
