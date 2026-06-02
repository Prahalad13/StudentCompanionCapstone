export interface HealthWellnessService {

    id?: number;
    mood: string;
    stressLevel: number;
    sleepHours: number;
    energyLevel: number;
    productivity: number;
    notes: string;
    dateLogged: string; // yyyy-MM-dd
    student?: any;
    studentId?: number; // used when sending to backend

}