import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';
import { UserService } from 'src/app/core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';


describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  let mockUserService: any;
  let mockAuthService: any;
  let mockToastrService: any;
  let mockRouterService: any;

  beforeEach(async(() => {
    mockUserService = jasmine.createSpyObj(['']);
    mockAuthService = jasmine.createSpyObj(['']);
    mockToastrService = jasmine.createSpyObj(['']);
    mockRouterService = jasmine.createSpyObj(['']);

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
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
