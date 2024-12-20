import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmasRequestsComponent } from './rmas-requests.component';

describe('RmasRequestsComponent', () => {
  let component: RmasRequestsComponent;
  let fixture: ComponentFixture<RmasRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmasRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RmasRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
