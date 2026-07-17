import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor(private http: HttpClient) {}

  getHelp(topic: string) {
	return this.http.get<any[]>(
	  `${API_BASE_URL}/api/v1/help/${topic}`
	);
  }
}