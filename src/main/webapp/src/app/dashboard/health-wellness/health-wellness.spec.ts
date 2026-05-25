import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthWellness } from './health-wellness';

describe('HealthWellness', () => {
  let component: HealthWellness;
  let fixture: ComponentFixture<HealthWellness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HealthWellness],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthWellness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
