import { Injectable, EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const healthWellnessUrl = '/api/v1/healthwellness'
@Injectable({
  providedIn: 'root',
})
export class HealthWellnessService {

  onWellnessUpdated = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  getByStudent(studentId: number) {
    const token = localStorage.getItem('token');

    return this.http.get<any>(
      `${healthWellnessUrl}/student/${studentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  getById(id: number) {
    const token = localStorage.getItem('token');

    return this.http.get<any>(
      `${healthWellnessUrl}/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  create(wellness: any) {
    const token = localStorage.getItem('token');

    return this.http.post<any>(
      healthWellnessUrl,
      wellness,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  update(id: number, wellness: any) {
    const token = localStorage.getItem('token');

    return this.http.put<any>(
      `${healthWellnessUrl}/${id}`,
      wellness,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  // DELETE a course
    delete(id: number): Observable<void> {
      const token = localStorage.getItem('token');
  
      return this.http.delete<void>(
        `${healthWellnessUrl}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    }

    getByDate(date: string) {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(
      `${healthWellnessUrl}/date/${date}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  getByStudentForWeek(studentId: number) {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(
      `${healthWellnessUrl}/student/${studentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
      map(entries => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        return entries.filter(e => {
          const d = new Date(e.date || e.dateLogged);
          return d >= startOfWeek && d < endOfWeek;
        });
      })
    );
  }



}
