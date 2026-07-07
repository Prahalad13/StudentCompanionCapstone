import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly url = '/api/v1/chat';

  constructor(private http: HttpClient) {}

  sendMessage(studentId: number, message: string): Observable<{ reply: string }> {
    const token = localStorage.getItem('token');
    return this.http.post<{ reply: string }>(
      this.url,
      { studentId, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}