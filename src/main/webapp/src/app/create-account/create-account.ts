import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-create-account',
  imports: [FormsModule, RouterModule],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
})
export class CreateAccount {

  user = {
    email: '',
    password: '',
    role: 'USER'
  };

  confirmPassword = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}
  
  register(): void {

  if (this.user.password !== this.confirmPassword) {
    console.log("Passwords do not match");
    return;
  }

  this.userService.register(this.user).subscribe({
    next: (response) => {
      console.log("User registered!", response);

      // Do NOT store token
      // Do NOT auto-login
      // redirect to users login page
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.log("Registration failed", err);
    }
  });
}


}
