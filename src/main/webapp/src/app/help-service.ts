import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor(private http: HttpClient) {}

  getHelp(topic: string) {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/help/${topic}`);
  }
}