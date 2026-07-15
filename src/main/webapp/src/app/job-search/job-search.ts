import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { JobService } from '../job.service';
import { Job } from '../job';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-job-search',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule, RouterModule
  ],

  templateUrl: './job-search.html',

  styleUrls: ['./job-search.css']
})
export class JobSearchComponent {

  title = '';

  city = '';

  type = 'remote';

  jobs: Job[] = [];

  constructor(
    private jobService: JobService,
	private cdr: ChangeDetectorRef
  ) {}

  searchJobs() {

    this.jobService.searchJobs(
      this.title,
      this.city,
      this.type
    ).subscribe({

      next: (data) => {

        console.log(data);

        this.jobs = data;
      },

      error: (err) => {

        console.log(err);
      }
    });
	this.cdr.detectChanges();
  }
 }