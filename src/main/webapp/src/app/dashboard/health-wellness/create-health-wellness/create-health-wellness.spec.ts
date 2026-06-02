import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHealthWellness } from './create-health-wellness';

describe('CreateHealthWellness', () => {
  let component: CreateHealthWellness;
  let fixture: ComponentFixture<CreateHealthWellness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHealthWellness],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateHealthWellness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
