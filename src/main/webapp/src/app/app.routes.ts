import { Routes } from '@angular/router';
import { CreateAccount } from './create-account/create-account';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { CreateStudent } from './dashboard/create-student/create-student';
import { Courses } from './dashboard/courses/courses';
import { Assessments } from './dashboard/assessments/assessments';
import { JobSearchComponent } from './job-search/job-search';
import { HealthWellness } from './dashboard/health-wellness/health-wellness';
import { CreateHealthWellness } from './dashboard/health-wellness/create-health-wellness/create-health-wellness';
import { Calendar } from './dashboard/calendar/calendar';
import { Chat } from './dashboard/chat/chat';
import { Summarizer } from './dashboard/summarizer/summarizer';

export const routes: Routes = [
    { path: 'register', component: CreateAccount},
    { path: 'login', component: Login},
    { path: 'dashboard', component: Dashboard, runGuardsAndResolvers: 'always'},
    { path: 'dashboard/create-student', component: CreateStudent},
    { path: 'dashboard/courses', component: Courses},
    { path: 'dashboard/assessments', component: Assessments},
	{ path: 'dashboard/jobs', component: JobSearchComponent},
    { path: 'dashboard/health-wellness', component: HealthWellness, runGuardsAndResolvers: 'always'},
    { path: 'dashboard/health-wellness/create-health-wellness', component: CreateHealthWellness, runGuardsAndResolvers: 'always'},
	{ path: 'dashboard/chat', component: Chat},
	{ path: 'dashboard/summarizer', component: Summarizer},
    { path: 'dashboard/calendar', component: Calendar},
    { path: '', redirectTo: 'login', pathMatch: 'full'}
];