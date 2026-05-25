import { Injectable, EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
