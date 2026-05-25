import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user';

const authUrl = '/api/v1/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  onUserAdded = new EventEmitter<User>();

  constructor(private http: HttpClient) {}

  register(request: any): Observable<any> {
    return this.http.post(`${authUrl}/register`, request);
  }

  authenticate(request: any): Observable<any> {
    return this.http.post(`${authUrl}/authenticate`, request);
  }

  logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
}
}
