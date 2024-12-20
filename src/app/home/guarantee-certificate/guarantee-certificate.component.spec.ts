import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteeCertificateComponent } from './guarantee-certificate.component';

describe('GuaranteeCertificateComponent', () => {
  let component: GuaranteeCertificateComponent;
  let fixture: ComponentFixture<GuaranteeCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuaranteeCertificateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuaranteeCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
