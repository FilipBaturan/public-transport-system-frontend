import { TestBed } from '@angular/core/testing';

import { TransportLineService } from './transportLine.service';

describe('TransportLineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransportLineService = TestBed.get(TransportLineService);
    expect(service).toBeTruthy();
  });
});
