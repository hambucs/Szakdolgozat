import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule] 
})
export class RegisterComponent {
  
  user = {
    username: '',
    email: '',
    PasswordHash: '',
  };

  message = '';
  isLoading = false; 

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
      if (!this.user.username || !this.user.email || !this.user.PasswordHash) {
      this.message = 'Please fill out all fields';
      return;
    }

    this.isLoading = true;

    this.http.post('http://localhost:5062/api/users/register', this.user)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.message = 'A regisztráció sikeres!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          this.message = err.error?.message || 'A regisztráció sikertelen. Kérjük próbálja újra.';
        }
      });
  }
}