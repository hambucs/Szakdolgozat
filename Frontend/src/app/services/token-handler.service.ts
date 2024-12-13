import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import jwt from 'jsonwebtoken';

@Injectable({
  providedIn: 'root'
})
export class TokenHandlerService {

  private secretKey: string = 'secre';

  decodeToken(token: string): any {
    try {
      const decodedToken = jwtDecode(token);
     
      return decodedToken ?? null;
    } catch (error) {
      
      return null;
    }
  }
  getToken(): any {
    const cookies = document.cookie.split(";");
    let token: string | null = null;

    for (let item of cookies) {
      if (item.includes("token")) {
        token = item.split("=")[1];
        token = this.decodeToken(token);
        
       
      }
    }

    if (token && !this.verifyToken(token)) {
      this.clearCookie('token');
      token = null;
    }

    return token;
  }
  
  getNotDecodedToken():any {
    const cookies = document.cookie.split(";");
    let token: string | null = null;

    for (let item of cookies) {
      if (item.includes("token")) {
        token = item.split("=")[1];

      }
    }
 
  

    return token;


  }

  verifyToken(token: any): boolean {
   const time=Math.floor(Date.now() / 1000);
   
   
   ;
   return token.exp>=time;
  }

  clearCookie(name: string): void {
    const path = window.location.pathname;  
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
   
  
  }
}