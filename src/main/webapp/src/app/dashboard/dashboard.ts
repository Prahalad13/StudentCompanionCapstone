import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { StudentService } from '../services/student-service';
import { CalendarService } from '../services/calendar-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { AssessmentService } from '../services/assessment-service';
import { HealthWellnessService } from '../services/health-wellness-service';
import { TermPerformance } from '../term-performance';
import { CourseService } from '../services/course-service';
import { CoursePerformance } from '../course-performance';
import { CourseProgress } from '../course-progress';

interface WellnessEntry {
	mood: string;
	stress: number | string;
	energy?: number | string;
	energyLevel?: number | string;
	productivity: number | string;
	date?: string;
	dateLogged?: string;
}



@Component({
	selector: 'app-dashboard',
	imports: [RouterLink, CommonModule, BaseChartDirective, FormsModule],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

	student: any = null;
	studentName: string | null = null;
	email: string | null = null;
	assessments: any[] = [];
	upcomingAssessments: any[] = [];
	overdueAssessments: any[] = [];
	today: Date = new Date();
	termPerformance: TermPerformance[] = [];

	selectedTerm?: TermPerformance;
	
	overallPercentage = 0;
	overallGrade = '';
	overallCompleted = false;
	coursePerformance: CoursePerformance[] = [];
	selectedTermName = '';
	// COURSE PROGRESS
	courseChartLabels: string[] = [];
	courseChartData: number[] = [];
	courseProgress: CourseProgress[] = [];
	selectedCourseName = "";
	courseChart:any;
	completedAssessments = 0;
	totalAssessments = 0;
	courseChartOptions: any = {
		    responsive:true,
		    maintainAspectRatio:false,
		    plugins:{
		        legend:{
		            display:false
		        }
		    },
		    scales:{
		        y:{
		            min:0,
		            max:100,
		            ticks:{
		                stepSize:20,
		                color:"#F3F3F3",
		                font:{
		                    size:13,
		                    weight:"bold"
		                }
		            },
		            grid:{
		                color:"rgba(255,255,255,.1)"
		            }
		        },
				x: {
				    ticks: {
				        autoSkip: false,      // IMPORTANT
				        maxRotation: 0,
				        minRotation: 0,
				        color: "#F3F3F3",
				        font: {
				            size: 12,
				            weight: "bold"
				        }
				    },
				    grid: {
				        display: false
				    }
				}
		    }
		};
	// COMPLETION CHART
	completionChartData: number[] = [];
	completionChart: any;
	completedCount = 0;
	upcomingCount = 0;
	overdueCount = 0;
	// WEEKLY PRODUCTIVITY
	weeklyChartLabels = [
	    "Mon",
	    "Tue",
	    "Wed",
	    "Thu",
	    "Fri",
	    "Sat",
	    "Sun"
	];
	weeklyChartOptions: any = {
	    responsive:true,
	    maintainAspectRatio:false,
	    plugins:{
	        legend:{
	            labels:{
	                color:"#F4F4F4",
	                font:{
	                    size:13,
	                    weight:"bold"
	                }
	            }
	        }
	    },
	    scales:{
	        y:{
	            beginAtZero:true,
	            ticks:{
	                color:"#F4F4F4",
	                stepSize:2
	            },
	            grid:{
	                color:"rgba(255,255,255,.08)"
	            }
	        },
	        x:{
	            ticks:{
	                color:"#F4F4F4",
	                font:{
	                    size:12,
	                    weight:"bold"
	                }
	            },
	            grid:{
	                display:false
	            }
	        }
	    }
	};
	weeklyChart: any;
	allocatedHours = 0;
	spentHours = 0;
	studyEfficiency = 0;
	todayHours = 0;
	pendingAssessments: any[] = [];
	selectedAssessmentId: number = 0;
	studyMessage = "";
	selectedAssessment: any = null;
	assessmentAllocatedHours = 0;
	assessmentSpentHours = 0;
	assessmentRemainingHours = 0;
	assessmentProgress = 0;
	// HEALTH & WELLNESS DASHBOARD
	wellnessEntries: WellnessEntry[] = [];

	averageMood: string = 'No Data';
	averageMoodGif: string | null = null;
	averageMoodMessage: string = '';

	stabilityScore: number = 0;
	stabilityGif: string | null = null;

	energyLabels: string[] = [];
	energyData: number[] = [];

	productivityLabels: string[] = [];
	productivityData: number[] = [];

	emojiMap: any = {
		Happy: {
			gif: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f604/512.gif'
		},
		Neutral: {
			gif: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f610/512.gif'
		},
		Sad: {
			gif: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif'
		},
		Stressed: {
			gif: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f620/512.gif'
		},
		Tired: {
			gif: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f62a/512.gif'
		}
	};

	// Energy Trend options
	energyChartData: any = {
  labels: [],
  datasets: [
    {
      data: [],
      showLine: false,
      pointRadius: 8,
      pointBackgroundColor: '#36A2EB',
      pointBorderWidth: 0
    }
  ]
};

energyOptions = {
  plugins: {
    legend: {
      display: true,
      labels: {
		color: '#9ca3af',
        boxWidth: 40,
        boxHeight: 12,
        borderWidth: 0,
      }
    },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `Energy: ${ctx.raw}`
      }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.1)' },
      ticks: { color: '#9ca3af' }
    },
    y: {
      min: 0,
      max: 3,
      ticks: {
        stepSize: 1,
        color: '#9ca3af'
      },
      grid: { color: 'rgba(255,255,255,0.1)' }
    }
  }
};
	// Productivity Flow options

	productivityOptions = {
		scales: {
			y: {
				min: 0,
				max: 10,
				ticks: {
					stepSize: 1
				}
			}
		}
	};
	stabilitySummary: string = '';

	stressPercent: number = 0;
	energyPercent: number = 0;
	productivityPercent: number = 0;
	constructor(
		private authService: AuthService,
		public router: Router,
		private studentService: StudentService,
		private calendarService: CalendarService,
		private cdr: ChangeDetectorRef,
		private assessmentService: AssessmentService,
		private wellnessService: HealthWellnessService,
		private courseService: CourseService
	) { }

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
				this.loadTermPerformance(savedStudent.id);
				this.loadWellness(savedStudent.id);
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
						this.loadTermPerformance(res.id);
						this.loadWellness(res.id);
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

	// Show only the first 6 assessments on the dashboard
	get limitedAssessments() {
		return this.assessments.slice(0, 6);
	}

	// Check if there are more than 6 assessments
	get hasMoreAssessments() {
		return this.assessments.length > 6;
	}
	loadAnalytics(studentId:number){
	    this.assessmentService
	        .getByStudent(studentId)
	        .subscribe((data:any[])=>{
	            this.assessments = data;
	            const today = new Date();
	            today.setHours(0,0,0,0);
	            // Upcoming
	            this.upcomingAssessments =
	                data
	                    .filter(a => {
	                        const due = new Date(a.dueDate);
	                        due.setHours(0,0,0,0);
	                        return due >= today;
	                    })
	                    .sort((a,b)=>
	                        new Date(a.dueDate).getTime()
	                        -
	                        new Date(b.dueDate).getTime()
	                    );
	            // Overdue
	            this.overdueAssessments =
	                data
	                    .filter(a => {
	                        const due = new Date(a.dueDate);
	                        due.setHours(0,0,0,0);
	                        return due < today;
	                    })
	                    .sort((a,b)=>
	                        new Date(b.dueDate).getTime()
	                        -
	                        new Date(a.dueDate).getTime()
	                    );
	            this.cdr.detectChanges();
	        });
	}
	loadTermPerformance(studentId: number) {
	  this.courseService
	      .getTermPerformance(studentId)
	      .subscribe((terms) => {
	        this.termPerformance = terms;
			if (terms.length > 0) {
			    // Select Summer 2026 if it exists,
			    // otherwise select the first term
			    this.selectedTerm =
			        terms.find(t => t.term === "Summer 2026")
			        ?? terms[0];
			    this.selectedTermName =
			        this.selectedTerm.term;
			    this.overallPercentage =
			        this.selectedTerm.averagePercentage;
			    this.overallGrade =
			        this.selectedTerm.letterGrade;
			    this.overallCompleted =
			        this.selectedTerm.completed;
			    // Load all courses in this term
			    this.loadCoursesForTerm();
			}
	        this.cdr.detectChanges();
	      });
	}	
	loadCoursesForTerm() {
	    this.courseService
	        .getCoursesForTerm(
	            this.student.id,
	            this.selectedTermName
	        )
	        .subscribe({
	            next: (data) => {
	                console.log("Course Performance:", data);
	                this.coursePerformance = data;
					if(data.length){
					    this.selectedCourseName =
					        data[0].courseName;
					    this.loadCourseProgress();
					}
	                this.cdr.detectChanges();
	            },
	            error: (err) => {
	                console.error(err);
	            }
	        });
	}
	loadCourseProgress() {
	    if (!this.student?.id ||
	        !this.selectedTermName ||
	        !this.selectedCourseName) {
	        return;
	    }
	    this.courseService
	        .getCourseProgress(
	            this.student.id,
	            this.selectedTermName,
	            this.selectedCourseName
	        )
	        .subscribe({
	            next: (data) => {
	                this.courseProgress = data;					
	                // X-axis labels
					this.courseChartLabels = data.map(x => {
					    let label = x.assessmentName
					        .replace(this.selectedCourseName + " ", "")
					        .replace(" Exam", "")
					        .replace(" Assignment", "")
					        .replace(" Test", "")
					        .replace(" 1", "")
					        .trim();
					    return label;
					});
	                // Y-axis values
	                this.courseChartData = data.map(x => x.percentage);
	                // Chart object
	                this.courseChart = {
	                    labels: this.courseChartLabels,
	                    datasets: [
	                        {
	                            label: "Progress",
	                            data: this.courseChartData,
	                            backgroundColor: "#6DFF65",
	                            borderRadius: 10,
	                            borderSkipped: false,
	                            barThickness: 45
	                        }
	                    ]
	                };
	                // Optional summary
	                this.completedAssessments =
	                    data.filter(x => x.completed).length;
	                this.totalAssessments = data.length;
					// =====================================
					// STUDY HOURS CHART
					// =====================================
					this.weeklyChart = {
					    labels: this.courseChartLabels,
					    datasets: [
					        {
					            label: "Allocated Hours",
					            data: data.map(x => x.allocatedStudyHours),
					            backgroundColor: "#4FA3FF"
					        },
							{
							    label: "Hours Spent",
							    data: data.map(x => x.hoursSpent || 0),
							    backgroundColor: "#6DFF65"
							}
					    ]
					};
					this.allocatedHours =
					    data.reduce(
					        (sum, x) =>
					            sum + (x.allocatedStudyHours || 0),
					        0
					    );
					this.spentHours =
					    data.reduce(
					        (sum, x) =>
					            sum + (x.hoursSpent || 0),
					        0
					    );
					this.studyEfficiency =
					    this.allocatedHours > 0
					        ? Math.round(
					            (this.spentHours /
					             this.allocatedHours) * 100
					        )
					        : 0;
					// Pending assessments for Study Progress card
					this.pendingAssessments =
					    data.filter(a => !a.completed);
					if (this.pendingAssessments.length > 0) {
					    this.selectedAssessmentId =
					        this.pendingAssessments[0].id;
						this.updateAssessmentProgress();
					}
	                this.cdr.detectChanges();
					this.loadAssessmentCompletion();
	            },
	            error: (err) => {
	                console.error("Course progress error:", err);
	            }
	        });
	}
	loadAssessmentCompletion() {
	    this.assessmentService
	        .getAssessmentCompletion(
	            this.student.id,
	            this.selectedTermName,
	            this.selectedCourseName
	        )
	        .subscribe(data => {
	            this.completedCount = data.completed;
	            this.upcomingCount = data.upcoming;
	            this.overdueCount = data.overdue;
	            this.completionChart = {
	                labels: [
	                    "Completed",
	                    "Upcoming",
	                    "Overdue"
	                ],
	                datasets: [
	                    {
	                        data: [
	                            data.completed,
	                            data.upcoming,
	                            data.overdue
	                        ],
	                        backgroundColor: [
	                            "#66E46A",   // green
	                            "#4FA3FF",   // blue
	                            "#FF6B6B"    // red
	                        ],
	                        borderWidth: 0
	                    }
	                ]
	            };
	            this.cdr.detectChanges();
	        });
	}
	changeTerm(term: string) {

	    this.selectedTerm =
	        this.termPerformance.find(
	            t => t.term === term
	        );
	    this.selectedTermName = term;
	    this.loadCoursesForTerm();
		this.loadAssessmentCompletion();
		this.cdr.detectChanges();
	}
	logStudyHours() {
	    if (!this.selectedAssessmentId) {
	        return;
	    }
	    if (this.todayHours <= 0) {
	        return;
	    }
	    this.assessmentService
	        .addStudyHours(
	            this.selectedAssessmentId,
	            this.todayHours
	        )
	        .subscribe({
				next: () => {
				    const assessment = this.pendingAssessments.find(
				        a => a.id === this.selectedAssessmentId
				    );
				    this.studyMessage =
				        `${this.todayHours} hour(s) logged for ${assessment?.assessmentName}`;
				    this.todayHours = 0;
				    this.loadCourseProgress();
					this.cdr.detectChanges();
				    // Optional: Hide the message after 4 seconds
				    setTimeout(() => {
				        this.studyMessage = "";
				    }, 4000);
				}				
	        });			
	}
	updateAssessmentProgress(){
	    this.selectedAssessment =
	        this.pendingAssessments.find(
	            a => a.id === this.selectedAssessmentId
	        );
	    if(!this.selectedAssessment){
	        return;
	    }
	    this.assessmentAllocatedHours =
	        this.selectedAssessment.allocatedStudyHours || 0;
	    this.assessmentSpentHours =
	        this.selectedAssessment.hoursSpent || 0;
	    this.assessmentRemainingHours =
	        this.assessmentAllocatedHours	        -
	        this.assessmentSpentHours;
	    this.assessmentProgress =
	        this.assessmentAllocatedHours > 0
	        ?
	        Math.round(
	            this.assessmentSpentHours
	            /
	            this.assessmentAllocatedHours
	            *
	            100
	        )
	        :
	        0;
	}
	// calendar route
	goToCalendar() {
  this.router.navigate(['/dashboard/calendar']).then(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  });
}


	// health and wellness logic

	loadWellness(studentId: number) {
  this.wellnessService.getByStudent(studentId).subscribe({
    next: (entries: WellnessEntry[]) => {

      const week = this.getCurrentWeekRange();

	  console.log("🔥 BACKEND RAW ENTRIES:", entries);

      // Step 1 — filter to current week
      const weeklyEntries = entries.filter(e => {
        const raw = e.date ?? e.dateLogged!;
        const onlyDate = raw.split('T')[0];
        const [y, m, d] = onlyDate.split('-').map(Number);
        const entryDate = new Date(y, m - 1, d);

        return week.some(w => w.toDateString() === entryDate.toDateString());
      });

      // Step 2 — group by date
      const grouped: Record<string, WellnessEntry[]> = {};
      weeklyEntries.forEach(e => {
        const raw = e.date ?? e.dateLogged!;
        const onlyDate = raw.split('T')[0];
        if (!grouped[onlyDate]) grouped[onlyDate] = [];
        grouped[onlyDate].push(e);
      });

      // Step 3 — pick the LAST entry for each day
let finalEntries = Object.values(grouped).map(list => list[list.length - 1]);

// ⭐ If no entries this week → fallback to ALL entries
if (finalEntries.length === 0) {
  console.log("⚠️ No entries this week — using ALL entries for mood & stability");
  finalEntries = entries; // use full history
}

// Step 4 — normalize
this.wellnessEntries = this.normalizeEntries(finalEntries);

      // Step 5 — compute dashboard values
      this.averageMood = this.calculateAverageMood(this.wellnessEntries);
      this.averageMoodGif = this.emojiMap[this.averageMood]?.gif || null;
      this.averageMoodMessage = this.getMoodMessage(this.averageMood);

      this.stabilityScore = this.calculateStability(this.wellnessEntries);
      this.stabilityGif = this.getStabilityEmoji(this.stabilityScore);

      this.stabilitySummary = this.generateStabilitySummary(this.stabilityScore);
      this.computeBreakdown(this.wellnessEntries);

      const energy = this.getEnergyTrend(this.wellnessEntries);
      this.energyLabels = energy.labels;
      this.energyData = energy.data;

	// ⭐ If no data, show a harmless placeholder so Chart.js doesn't crash
if (this.energyData.length === 0) {
  this.energyChartData = {
    labels: ['No Data'],
    datasets: [
      {
        label: 'Energy',
        data: [0],
        fill: true,
        tension: 0.5,
        borderColor: 'rgba(54,162,235,0.3)',
        backgroundColor: 'rgba(54,162,235,0.1)',
        pointRadius: 0
      }
    ]
  };
} else {
  // ⭐ Normal wave chart
  this.energyChartData = {
    labels: this.energyLabels,
    datasets: [
      {
        label: 'Energy',
        data: this.energyData,
        fill: true,
        tension: 0.5,
        borderColor: 'rgba(54,162,235,0.8)',
        backgroundColor: 'rgba(54,162,235,0.25)',
        pointRadius: 0,
        pointHoverRadius: 6
      }
    ]
  };
}
      const productivity = this.getProductivityFlow(this.wellnessEntries);
      this.productivityLabels = productivity.labels;
      this.productivityData = productivity.data;

      this.cdr.detectChanges();
    }
  });
}

	calculateAverageMood(entries: WellnessEntry[]): string {
		if (!entries || entries.length === 0) return 'No Data';

		const moodWeights: any = {
			Happy: 5,
			Neutral: 3,
			Sad: 2,
			Tired: 2,
			Stressed: 1
		};

		let total = 0;
		entries.forEach(e => {
			total += moodWeights[e.mood] || 0;
		});

		const avg = total / entries.length;

		if (avg >= 4) return 'Happy';
		if (avg >= 3) return 'Neutral';
		if (avg >= 2) return 'Sad';
		return 'Stressed';
	}

	getMoodMessage(mood: string): string {
		switch (mood) {
			case 'Happy':
				return 'Great job! Keep maintaining this positive momentum.';
			case 'Neutral':
				return 'You\'re steady this week — stay balanced and mindful.';
			case 'Sad':
				return 'It’s okay to slow down. Take time for yourself.';
			case 'Stressed':
				return 'Remember to breathe. Try taking short breaks to reset.';
			case 'Tired':
				return 'Rest is important. Try to recharge when you can.';
			default:
				return 'No wellness data available.';
		}
	}

	// helper function

	toNumber(value: any): number {
		if (value === null || value === undefined) return 0;

		if (typeof value === 'string') {
			if (value.trim() === '') return 0;

			if (value.includes('/')) {
				return Number(value.split('/')[0]);
			}

			return Number(value);
		}

		return Number(value);
	}



	calculateStability(entries: WellnessEntry[]): number {
		if (!entries || entries.length === 0) return 0;

		let total = 0;

		entries.forEach(e => {
			const stressScore = 10 - this.toNumber(e.stress);
			const energyScore = this.toNumber(e.energy);
			const productivityScore = this.toNumber(e.productivity);

			total += stressScore + energyScore + productivityScore;
		});

		const maxPossible = entries.length * 30;
		return Math.round((total / maxPossible) * 100);
	}

	normalizeEntries(entries: WellnessEntry[]): WellnessEntry[] {
		return entries.map(e => ({
			...e,
			stress: this.toNumber(e.stress),
			energy: this.toNumber(e.energy ?? e.energyLevel),
			productivity: this.toNumber(e.productivity)
		}));
	}


	computeBreakdown(entries: WellnessEntry[]) {
		if (!entries.length) return;

		const avgStress = entries.reduce((a, e) => a + this.toNumber(e.stress), 0) / entries.length;
		const avgEnergy = entries.reduce((a, e) => a + this.toNumber(e.energy), 0) / entries.length;
		const avgProductivity = entries.reduce((a, e) => a + this.toNumber(e.productivity), 0) / entries.length;

		this.stressPercent = Math.round((avgStress / 10) * 100);
		this.energyPercent = Math.round((avgEnergy / 10) * 100);
		this.productivityPercent = Math.round((avgProductivity / 10) * 100);
	}

	generateStabilitySummary(score: number): string {
		if (score >= 75) return "A strong and steady week — great balance overall.";
		if (score >= 50) return "A fairly stable week with some fluctuations.";
		if (score >= 30) return "Some ups and downs — try pacing your workload.";
		return "A challenging week — take time to rest and reset.";
	}

	getStabilityEmoji(score: number): string {
		if (score >= 75) return this.emojiMap.Happy.gif;
		if (score >= 50) return this.emojiMap.Neutral.gif;
		if (score >= 30) return this.emojiMap.Tired.gif;
		return this.emojiMap.Stressed.gif;
	}

	getEnergyTrend(entries: WellnessEntry[]) {
    return this.mapEntriesToWeek(entries, e => this.toNumber(e.energy ?? e.energyLevel));
}
	// helper function

	private getCurrentWeekRange(): Date[] {
		const today = new Date();
		const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ...
		const monday = new Date(today);
		monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

		const week: Date[] = [];
		for (let i = 0; i < 7; i++) {
			const d = new Date(monday);
			d.setDate(monday.getDate() + i);
			week.push(d);
		}

		return week;
	}

private mapEntriesToWeek(
  entries: WellnessEntry[],
  selector: (e: WellnessEntry) => number
) {
  const week = this.getCurrentWeekRange();
  const labels: string[] = [];
  const data: number[] = [];

  // -----------------------------
  // 1️⃣ TRY USING THIS WEEK'S DATA
  // -----------------------------
  week.forEach(day => {
    const dayEntries = entries.filter(e => {
      const raw = e.date ?? e.dateLogged!;
      const onlyDate = raw.split('T')[0];
      const [y, m, d] = onlyDate.split('-').map(Number);
      const entryDate = new Date(y, m - 1, d);
      return entryDate.toDateString() === day.toDateString();
    });

    const entry = dayEntries[dayEntries.length - 1] ?? null;

    labels.push(day.toLocaleDateString('en-US', { weekday: 'short' }));
    data.push(entry ? selector(entry) : 0);
  });

  // If ANY real data exists this week → use it
  if (data.some(v => v > 0)) {
    return { labels, data };
  }

  // ---------------------------------------------------
  // 2️⃣ FALLBACK: NO WEEKLY DATA → USE LAST 7 ENTRIES
  // ---------------------------------------------------
  // ⭐ Fallback: map last 7 entries to their REAL weekday
console.log("⚠️ No weekly data — using last entries instead");

const sorted = [...entries].sort((a, b) => {
  const rawA = (a.date ?? a.dateLogged)!;
  const rawB = (b.date ?? b.dateLogged)!;

  const [yA, mA, dA] = rawA.split('T')[0].split('-').map(Number);
  const [yB, mB, dB] = rawB.split('T')[0].split('-').map(Number);

  const da = new Date(yA, mA - 1, dA);
  const db = new Date(yB, mB - 1, dB);

  return da.getTime() - db.getTime();
});

const last7 = sorted.slice(-7);

// Reset data but KEEP Mon–Sun labels
data.length = 0;

// Build a map: weekday → value
const weekdayMap: Record<number, number> = {};

last7.forEach(e => {
  const raw = e.date ?? e.dateLogged!;
  const [y, m, dNum] = raw.split('T')[0].split('-').map(Number);
  const d = new Date(y, m - 1, dNum);   // 👈 LOCAL date, no UTC shift

  const weekday = d.getDay();           // 0=Sun,1=Mon,...6=Sat
  const normalized = (weekday + 6) % 7; // Mon=0..Sun=6

  weekdayMap[normalized] = selector(e);
});

// Fill Mon–Sun using the map
for (let i = 0; i < 7; i++) {
  data.push(weekdayMap[i] ?? 0);
}

return { labels, data };

}




	getProductivityFlow(entries: WellnessEntry[]) {
		return this.mapEntriesToWeek(entries, e => this.toNumber(e.productivity));
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['/login']);
	}

}