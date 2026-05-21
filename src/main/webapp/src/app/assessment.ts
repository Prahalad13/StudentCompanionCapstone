export interface Assessment {

  id?: number;

  title: string;

  dueDate: string;

  grade?: number;

  totalMarks?: number;

  completed?: boolean;

  studyHours?: number;

  weight?: number;

  course: {
    id: number;
    courseName?: string;
    term?: string;
  };

  student: {
    id: number;
  };
}