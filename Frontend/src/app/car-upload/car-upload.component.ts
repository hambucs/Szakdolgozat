import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { TokenHandlerService } from '../services/token-handler.service';


@Component({
  selector: 'app-car-upload',
  standalone: true,
  templateUrl: './car-upload.component.html',
  styleUrls: ['./car-upload.component.css'],
  imports: [FormsModule, CommonModule]
})
export class CarUploadComponent {
  car = {
    make: '',
    model: '',
    year: null,
    dailyRate: null,
    availableFrom: '',
    availableTo: '',
    description: '',
    mileage: null,
    location: '',
    isAvailable: true
  };

  successMessage: string = '';
  errorMessage: string = '';
  selectedFile: File | null = null;

  constructor(private tokenHandler: TokenHandlerService, private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onUploadCar(carForm: NgForm): void {
    if (carForm.valid && this.selectedFile) {
      const formData = new FormData();
      
      Object.entries(this.car).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });


      formData.append('imageFile', this.selectedFile);

      const token = this.tokenHandler.getNotDecodedToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post('http://localhost:5062/api/cars', formData, { headers }).subscribe(
        (response) => {
          this.successMessage = 'Az autó feltöltése sikeres volt!!';
          this.errorMessage = '';
          carForm.reset();
          this.selectedFile = null; 
        },
        (error) => {
          this.errorMessage = 'Hiba az autó feltöltésekor, próbálja újra.';
          this.successMessage = '';
          console.error('Autó feltöltési hiba:', error);
        }
      );
    } else {
      this.errorMessage = 'Kérem töltse ki az összes mezőt és töltsön fel egy képet.';
      this.successMessage = '';
    }
  }
}