import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './login/login';
import { CreateAccount } from './create-account/create-account';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateAccount, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('webapp');
}
