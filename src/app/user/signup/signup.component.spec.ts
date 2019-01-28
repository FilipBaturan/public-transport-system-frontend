import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  MatCheckboxModule, MatCardModule, MatDatepickerModule, MatNativeDateModule,
  MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule,
  MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SignupComponent } from './signup.component';
import { of, asyncScheduler } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';



@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  let mockUserService: any;
  let mockRouterService: any;

  beforeEach(async(() => {

    mockUserService = {
      isAuthenticated() { return true; },
      create() { return of('', asyncScheduler); }
    };

    spyOn(mockUserService, 'isAuthenticated').and.callThrough();
    spyOn(mockUserService, 'create').and.callThrough();
    mockRouterService = jasmine.createSpyObj(['navigate']);

    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      declarations: [SignupComponent, FakeNavBarComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouterService }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not register with invalid inputs', fakeAsync(() => {
    fixture.detectChanges();
    component.tryRegister();
    expect(mockUserService.create).toHaveBeenCalledTimes(0);
  }));

  it('should register with ivalid inputs', fakeAsync(() => {
    fixture.detectChanges();
    component.user = {
      id: null, name: 'null', lastName: 'null', email: 'null',
      username: 'null', password: 'null', telephone: 'null', active: true
    };
    component.tryRegister();
    tick();
    fixture.detectChanges();

    expect(mockUserService.create).toHaveBeenCalled();
    expect(mockRouterService.navigate).toHaveBeenCalled();
  }));
});
