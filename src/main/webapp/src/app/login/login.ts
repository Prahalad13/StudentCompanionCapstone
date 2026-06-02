import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loading = false;
  errorMessage: string | null = null;

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (res: any) => {
        this.authService.saveAuth(res.token, res.userId);

        this.authService.getMyStudent().subscribe(student => {
          if (student) {
            this.authService.saveStudent(student);
            this.authService.saveStudentId(student.id);
          }

          this.loading = false;
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = 'Invalid email or password.';
        this.loading = false;
      }
    });
  }
}
