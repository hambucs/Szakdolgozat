import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CarListComponent } from './car-list/car-list.component';
import { CarUploadComponent } from './car-upload/car-upload.component';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cars', component: CarListComponent },
  { path: 'about', component: AboutComponent },
  { path: 'car-upload', component: CarUploadComponent },
  { path: '**', redirectTo: '/login' }
];