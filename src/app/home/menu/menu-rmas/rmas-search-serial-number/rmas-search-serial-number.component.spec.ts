import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmasSearchSerialNumberComponent } from './rmas-search-serial-number.component';

describe('RmasSearchSerialNumberComponent', () => {
  let component: RmasSearchSerialNumberComponent;
  let fixture: ComponentFixture<RmasSearchSerialNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmasSearchSerialNumberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RmasSearchSerialNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
