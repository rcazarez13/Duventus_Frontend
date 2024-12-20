import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigRolesComponent } from './config-roles.component';

describe('ConfigRolesComponent', () => {
  let component: ConfigRolesComponent;
  let fixture: ComponentFixture<ConfigRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
