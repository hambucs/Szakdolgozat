import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenHandlerService } from '../services/token-handler.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  username: string | null = null;
  role: string | null = null;

  constructor(private tokenHandler: TokenHandlerService) {}

  ngOnInit() {
    const decodedToken = this.tokenHandler.getToken();
    if (decodedToken) {
      this.username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? null;
      this.role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? null;
      console.log('Felhasználónév:', this.username);
      console.log('Szerepkör:', this.role);
    } else {
      console.log('Nincs érvényes token vagy a token lejárt.');
    }
  }
} 