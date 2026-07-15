export interface Assessment {

  id?: number;

  title: string;

  dueDate: string;

  assessmentType?: 'QUIZ' | 'ASSIGNMENT' | 'MIDTERM' | 'FINAL' | 'PROJECT';

  totalMarks?: number;

  achievedMarks?: number;

  percentage?: number;

  letterGrade?: string;

  weight?: number;

  completed?: boolean | null;

  allocatedStudyHours?: number;

  hoursSpent?: number;

  course: {
    id: number;
    courseName?: string;
    term?: string;
  };

  student: {
    id: number;
  };

}