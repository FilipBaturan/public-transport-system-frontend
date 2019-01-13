import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  // mock
  let mockRouterService: any;
  let mockUserService: any;

  beforeEach(async(() => {

    mockRouterService = jasmine.createSpyObj(['navigate']);
    mockUserService = jasmine.createSpyObj(['isAuthenticated']);


    TestBed.configureTestingModule({
      declarations: [
        NavBarComponent
      ],
      providers: [
        { provide: Router, useValue: mockRouterService },
        { provide: UserService, useValue: mockUserService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
