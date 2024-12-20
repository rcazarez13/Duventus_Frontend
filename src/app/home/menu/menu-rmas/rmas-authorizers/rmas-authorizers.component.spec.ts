import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmasAuthorizersComponent } from './rmas-authorizers.component';

describe('RmasAuthorizersComponent', () => {
  let component: RmasAuthorizersComponent;
  let fixture: ComponentFixture<RmasAuthorizersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmasAuthorizersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RmasAuthorizersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
