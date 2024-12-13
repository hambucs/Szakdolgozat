import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarUploadComponent } from './car-upload.component';

describe('CarUploadComponent', () => {
  let component: CarUploadComponent;
  let fixture: ComponentFixture<CarUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
