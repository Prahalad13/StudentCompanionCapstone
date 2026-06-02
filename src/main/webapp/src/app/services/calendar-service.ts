import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const calendarUrl = '/api/v1/calendar';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) {}

  getCalendar(studentId: number): Observable<any[]> {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(
      `${calendarUrl}/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}