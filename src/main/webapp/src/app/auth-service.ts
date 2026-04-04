import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  // ⭐ LOGIN (this was missing)
  login(credentials: { email: string; password: string }) {
    return this.http.post<any>('/api/v1/auth/authenticate', credentials);
  }

  // save token + userId after login
  saveAuth(token: string, userId: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
  }

  // retrieve token for authorized requests
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // retrieve userId if needed
  getUserId(): number {
    return Number(localStorage.getItem('userId'));
  }

  // save studentId after creating a student
  saveStudentId(studentId: number) {
    localStorage.setItem('studentId', studentId.toString());
  }

  // retrieve studentId for courses/assessments
  getStudentId(): number {
    return Number(localStorage.getItem('studentId'));
  }

  // fetch full student profile from backend
  getMyStudent() {
    const token = this.getToken();

    return this.http.get<any>(
      '/api/v1/students/me',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  // store student object
  saveStudent(student: any) {
    localStorage.setItem('student', JSON.stringify(student));
  }

  // retrieve student object
  getStudent() {
    const data = localStorage.getItem('student');
    return data ? JSON.parse(data) : null;
  }

  // clear everything on logout
  logout() {
    localStorage.clear();
  }
}
