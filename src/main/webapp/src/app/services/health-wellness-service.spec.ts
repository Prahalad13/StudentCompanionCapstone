import { TestBed } from '@angular/core/testing';

import { HealthWellnessService } from './health-wellness-service';

describe('HealthWellnessService', () => {
  let service: HealthWellnessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthWellnessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
