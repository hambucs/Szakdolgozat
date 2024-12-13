import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule]
})
export class LoginComponent {
  user = {
    email: '',
    password: '',
  };
  message = '';
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}
  
  onLogin() {
    if (!this.user.email || !this.user.password) {
      this.message = 'Kérem töltse ki az összes mezőt';
      return;
    }

    this.isLoading = true;

    this.http.post('http://localhost:5062/api/users/login', this.user)
      .subscribe({
        next: (response: any) => {
          document.cookie = `token=${response.token}; SameSite=None; Secure`;
          this.isLoading = false;
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
          
          
        },
        error: (err) => {
          this.isLoading = false;
          this.message = 'Sikertelen bejelentkezés. Kérjük ellenőrízze az adatait.';
        }
      });
  }
}