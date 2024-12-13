import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenHandlerService } from '../services/token-handler.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule,  MatDatepickerModule,MatNativeDateModule,MatButtonModule, MatFormFieldModule, MatInputModule ],
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: any[] = [];
  isLoading = true;
  isImageOpen = false;
  isDateModalOpen = false;
  selectedCar: any = null;
  selectedImage: string = '';
  availableFrom: string = '';
  availableTo: string = ''; 
  availableFromDate: Date=new Date("1900-01-01");
  availableToDate: Date=new Date("1900-01-01");
  rentals:  any[] = [];

  constructor(private http: HttpClient, private tokenHandler: TokenHandlerService) {}
 
  ngOnInit(): void {
    this.fetchCars();
  }

  fetchCars(): void {
    this.http.get<any>('http://localhost:5062/api/cars').subscribe({
      next: (data) => {
        this.cars = data.$values;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching cars:', error);
        this.isLoading = false;
      }
    });
  }
  

  openImage(car: any): void {
    if (car.image) {
      this.selectedImage = 'data:image/jpeg;base64,' + car.image;
    } else {
      this.selectedImage = 'assets/default-car-image.jpg';
    }
    this.isImageOpen = true;
  }

  closeImage(): void {
    this.isImageOpen = false;
  }

  openDateModal(car: any): void {
    this.selectedCar = car; 
    this.availableFrom=car.availableFrom;
    this.availableTo=car.availableTo;
    this.isDateModalOpen = true; 
    this.availableFromDate = new Date(this.availableFrom.split('T')[0]);
    this.availableToDate = new Date(this.availableTo.split('T')[0]);
    this.http.get<any>('http://localhost:5062/api/rentals').subscribe({
      next: (data) => {
        this.rentals = data.$values;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching rentals:', error);
        this.isLoading = false;
      }
    });

  }

  closeDateModal(): void {
    this.isDateModalOpen = false; 
    this.availableFrom = '';
    this.availableTo = '';
    this.selectedCar=null;
  }

  isDateDisabled = (date: Date | null): boolean => {
    if (!date) return false;
   
    
    let dategood=this.isDateUnAvailable(date, this.availableFromDate, this.availableToDate);
    if (!dategood){
      return false;
    }

    for(let rental of this.rentals){
      console.log(rental);
      if(this.selectedCar.id==rental.carID){
        dategood=this.isDateUnAvailable(date, new Date(rental.rentalStart.split('T')[0]), new Date(rental.rentalEnd.split('T')[0]));
        if(dategood){ 
          return false;
        }
      }
      
    }

   return true;
  };
  isDateUnAvailable=(current:Date, From:Date, To:Date):boolean=>{
     const selectedDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
     const availableFromDate = new Date(From.getFullYear(), From.getMonth(), From.getDate());
     const availableToDate = new Date(To.getFullYear(), To.getMonth(), To.getDate());
     if (selectedDate < availableFromDate || selectedDate > availableToDate) {
       return false;
     }
   
     return true;
  }

  createReservation(): void {
    if (!this.availableFrom || !this.availableTo || new Date(this.availableFrom) > new Date(this.availableTo)) {
      alert("Kérem válasszon helyes dátumokat.");
      return;
    }
    
  
    const token = this.tokenHandler.getNotDecodedToken();
  
    if (!token) {
      alert("Nincs bejelentkezve. Kérem jelentkezzen be.");
      return;
    }
  
    const decodedToken = this.tokenHandler.getToken();
  
    const reservation = {
      CarID: this.selectedCar.id,
      RenterID: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      RentalStart: this.availableFrom,
      RentalEnd: this.availableTo,
      
    };
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    this.http.post('http://localhost:5062/api/rentals', reservation, { headers }).subscribe({
      next: (response) => {
        alert("A kölcsönzés sikeres volt!");
        this.closeDateModal();
      },
      error: (error) => {
        alert("Hiba az autó lefoglalásakor.");
      },
    });
  }  

}