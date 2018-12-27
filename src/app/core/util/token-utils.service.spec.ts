import { TestBed } from '@angular/core/testing';

import { TokenUtilsService } from './token-utils.service';

describe('TokenUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenUtilsService = TestBed.get(TokenUtilsService);
    expect(service).toBeTruthy();
  });
});
