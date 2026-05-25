import { Injectable, EventEmitter} from '@angular/core';
import { HttpClient } from '@angular/common/http';

const assessmentsUrl = '/api/v1/assessments'
@Injectable({
  providedIn: 'root',
})
export class AssessmentService {

  onAssessmentAdded = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  getByStudent(studentId: number) {
    const token = localStorage.getItem('token');

    return this.http.get<any[]>(
      `${assessmentsUrl}/student/${studentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  create(assessment: any) {
    const token = localStorage.getItem('token');

    return this.http.post<any>(
      assessmentsUrl,
      assessment,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }

  update(id: number, assessment: any) {
  const token = localStorage.getItem('token');

  return this.http.put<any>(
    `${assessmentsUrl}/${id}`,
    assessment,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
}

  delete(id: number) {
    const token = localStorage.getItem('token');

    return this.http.delete(
      `${assessmentsUrl}/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }
}
