import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { TokenHandlerService } from './services/token-handler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true, 
  imports: [RouterModule,CommonModule] 
})
export class AppComponent implements OnInit {

  title = 'car-rental-app';
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
  
    console.log('Nincs érvényes token vagy token lejárt.');
  }
  
  }
  logOut() {
    
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  
    
    window.location.reload();
  }
}