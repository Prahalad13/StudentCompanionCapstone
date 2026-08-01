export interface StudyPlan {
  assessmentId: number;
  title: string;
  courseName: string;
  assessmentType: string;
  dueDate: string;

  daysRemaining: number;

  allocatedHours: number;
  hoursSpent: number;
  remainingHours: number;

  

  requiredHoursPerDay: number;
  progressPercentage: number;

  weight: number;

  riskScore: number;
  riskLevel: 'OVERDUE' | 'HIGH' | 'MEDIUM' | 'LOW';

  recommendedHoursToday: number;

  riskFactors: string[];
  recommendation: string;
}