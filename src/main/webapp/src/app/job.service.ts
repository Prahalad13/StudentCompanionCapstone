import { Injectable }
from '@angular/core';

import { HttpClient }
from '@angular/common/http';

import { Observable }
from 'rxjs';

import { Job }
from './job';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private apiUrl =
    'http://localhost:8080/api/jobs';

  constructor(
    private http: HttpClient
  ) {}

  searchJobs(
    title: string,
    city: string,
    type: string
  ): Observable<Job[]> {

    return this.http.get<Job[]>(
      `${this.apiUrl}/search?title=${title}&city=${city}&type=${type}`
    );
  }
}