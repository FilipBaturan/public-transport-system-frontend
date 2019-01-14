import { TestBed } from '@angular/core/testing';

import { TokenUtilsService } from './token-utils.service';

describe('TokenUtilsService', () => {
  this.token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJudWxsIiwiYXVkaWVuY2UiOiJ3ZWIiLCJjcmVhdGVkIjoxNTQ2OTU4NzE1Njc3LCJleHAiOjE1NDY5OTQ3MTUsImF1dGhvcml0aWVzIjoiT1BFUkFURVIifQ.yJo-JOt-5iQ8SIxw0hM57TDFl9ZlruH9tB0-EM_-0wB2FspXHuE1VCWDJW7_bRStn-P0J1Q-Lx62x2fDYWNJ_g';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenUtilsService]
    });

    this.tokenUtilsService = TestBed.get(TokenUtilsService);
  });

  it('should be created', () => {
    const service: TokenUtilsService = TestBed.get(TokenUtilsService);
    expect(service).toBeTruthy();
  });

  it('should get current user role from token', () => {
    const roles = this.tokenUtilsService.getRoles(this.token);
    expect(roles).toContain('OPERATOR');
});
});
