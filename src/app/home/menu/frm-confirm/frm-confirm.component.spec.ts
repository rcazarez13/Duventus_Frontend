import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmConfirmComponent } from './frm-confirm.component';

describe('FrmConfirmComponent', () => {
  let component: FrmConfirmComponent;
  let fixture: ComponentFixture<FrmConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrmConfirmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FrmConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
