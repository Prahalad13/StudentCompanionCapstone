import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../student';

const studentUrl = '/api/v1/students';

@Injectable({
  providedIn: 'root',
})
export class StudentService {

  onStudentAdded = new EventEmitter<Student>();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(studentUrl);
  }

  create(student: any): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.post(
      studentUrl,
      student,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  getMyStudent(): Observable<Student | null> {
    const token = localStorage.getItem('token');

    return this.http.get<Student | null>(
      `${studentUrl}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}
