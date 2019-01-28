import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AuthComponent } from './auth.component';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { of, asyncScheduler, throwError } from 'rxjs';


describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  let mockUserService: any;
  let mockAuthService: any;
  let mockToastrService: any;
  let mockRouterService: any;

  let serverError: boolean;

  beforeEach(async(() => {
    serverError = false;

    mockUserService = {
      isAuthenticated() { return true; },
      authenticate() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          return of('', asyncScheduler);
        }
      }
    };

    spyOn(mockUserService, 'isAuthenticated').and.callThrough();
    spyOn(mockUserService, 'authenticate').and.callThrough();
    mockAuthService = jasmine.createSpyObj(['']);
    mockToastrService = jasmine.createSpyObj(['success', 'warning']);
    mockRouterService = jasmine.createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [ AuthComponent ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouterService }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should sign in with valid username and password', fakeAsync(() => {
    fixture.detectChanges();
    component.signin();
    tick();
    fixture.detectChanges();

    expect(mockToastrService.success).toHaveBeenCalled();
    expect(mockRouterService.navigate).toHaveBeenCalled();
  }));

  it('should not sign in with invalid username or password', fakeAsync(() => {
    fixture.detectChanges();
    serverError = true;
    component.signin();
    tick();
    fixture.detectChanges();

    expect(mockToastrService.warning).toHaveBeenCalled();
  }));
});
