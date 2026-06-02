export interface Assessment {

  id?: number;
  title: string;
  dueDate: string;
  grade?: number | undefined;
  totalMarks?: number | undefined;
  completed?: null;
  studyHours?: number | undefined;
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