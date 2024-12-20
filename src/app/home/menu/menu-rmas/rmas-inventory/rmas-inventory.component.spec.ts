import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmasInventoryComponent } from './rmas-inventory.component';

describe('RmasSearchSparePartsComponent', () => {
  let component: RmasInventoryComponent;
  let fixture: ComponentFixture<RmasInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RmasInventoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RmasInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
