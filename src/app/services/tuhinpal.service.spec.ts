import { TestBed } from '@angular/core/testing';

import { TuhinpalService } from './tuhinpal.service';

describe('TuhinpalService', () => {
  let service: TuhinpalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TuhinpalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
