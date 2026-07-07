import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SummaryResponse {
  summary: string;
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SummarizerService {

  private readonly url = '/api/v1/summarize';

  constructor(private http: HttpClient) {}

  summarize(file: File): Observable<SummaryResponse> {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<SummaryResponse>(this.url, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}