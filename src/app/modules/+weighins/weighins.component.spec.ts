import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighinsComponent } from './weighins.component';

describe('WeighinsComponent', () => {
  let component: WeighinsComponent;
  let fixture: ComponentFixture<WeighinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeighinsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeighinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
