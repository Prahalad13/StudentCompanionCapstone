import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { TermPerformance } from '../term-performance';
import { CoursePerformance } from '../course-performance';
import { CourseProgress } from '../course-progress';

const courseUrl = '/api/v1/courses';

@Injectable({
  providedIn: 'root',
})
export class CourseService {

  onCourseAdded = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  // GET all courses for a student
  getByStudent(studentId: number): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(
      `${courseUrl}/student/${studentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  // CREATE a course
  create(course: any): Observable<any> {
    const token = localStorage.getItem('token');

    return this.http.post(
      courseUrl,
      course,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  // UPDATE a course
update(id: number, course: any): Observable<any> {
  const token = localStorage.getItem('token');

  return this.http.put(
    `${courseUrl}/${id}`,
    course,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}


  // DELETE a course
  delete(id: number): Observable<void> {
    const token = localStorage.getItem('token');

    return this.http.delete<void>(
      `${courseUrl}/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }
  getTermPerformance(studentId: number): Observable<TermPerformance[]> {

    const token = localStorage.getItem('token');

    return this.http.get<TermPerformance[]>(
      `${courseUrl}/student/${studentId}/performance`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

  }
  getCoursesForTerm(studentId: number, term: string) {

      const token = localStorage.getItem('token');

      return this.http.get<CoursePerformance[]>(
          `${courseUrl}/student/${studentId}/performance/${encodeURIComponent(term)}`,
          {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          }
      );

  }
  getCourseProgress(

      studentId:number,

      term:string,

      courseName:string

  ){

      const token =
          localStorage.getItem("token");

      return this.http.get<CourseProgress[]>(

          `${courseUrl}/student/${studentId}/term/${term}/course/${courseName}`,

          {
              headers:{
                  Authorization:`Bearer ${token}`
              }
          }

      );

  }
}
