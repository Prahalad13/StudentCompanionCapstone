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

  selectedType = "all";

  jobs: Job[] = [];

  constructor(
    private jobService: JobService,
	private cdr: ChangeDetectorRef
  ) {}

  searchJobs() {

    this.jobService.searchJobs(
      this.title,
      this.city,
      this.selectedType
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
  formatJobType(type: string): string {

    if (!type) {
      return 'Not Specified';
    }

    return type
      .replace(/full_time/g, 'Full Time')
      .replace(/part_time/g, 'Part Time')
      .replace(/permanent/g, 'Permanent')
      .replace(/contract/g, 'Contract')
      .replace(/_/g, ' ');
  }
 }