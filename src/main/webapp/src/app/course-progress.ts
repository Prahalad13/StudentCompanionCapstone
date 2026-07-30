export interface CourseProgress{
	
	id: number;
    assessmentName:string;
    percentage:number;
    completed:boolean;
	allocatedStudyHours: number;
	hoursSpent: number;

}