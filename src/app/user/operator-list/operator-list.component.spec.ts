import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  MatCheckboxModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatMenuModule,
  MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  MatSortModule, MatTableModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { of, asyncScheduler, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { OperatorListComponent } from './operator-list.component';
import { User } from '../../model/users/user.model';
import { UserService } from '../../core/services/user.service';


@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('OperatorListComponent', () => {
  let component: OperatorListComponent;
  let fixture: ComponentFixture<OperatorListComponent>;

  let mockUserService: any;
  let mockToastrService: any;
  let tableMockComponent: any;

  let dbOperators: User[];
  let emptyUserList: boolean;

  let updateError: number;
  let addError: number;

  let newOperator: User;
  let existingUser: User;


  beforeEach(() => {

    emptyUserList = true;
    updateError = 200;
    addError = 200;

    newOperator = new User(null, "operator", "123", "Opera", "Tor",
      "opera@tor@gmail.com", true, "123123");

    existingUser = new User(2, "un2", "222", "Name2", "Lastname2", "email2", true, "2222");

    dbOperators = [
      new User(1, "un1", "111", "Name1", "Lastname1", "email1", true, "1111"),
      new User(2, "un2", "222", "Name2", "Lastname2", "email2", true, "2222"),
      new User(3, "un3", "333", "Name3", "Lastname3", "email3", true, "3333"),
      new User(4, "un4", "444", "Name4", "Lastname4", "email4", true, "4444"),
      new User(5, "un5", "555", "Name5", "Lastname5", "email5", true, "5555"),
    ];

    tableMockComponent = {
      renderRows() {
        return "";
      }
    }

    mockUserService = {
      getOperators() {
        if (emptyUserList) {
          return of([], asyncScheduler);
        } else {
          return of(dbOperators, asyncScheduler);
        }
      },
      updateOperator() {
        if (updateError == 200) {
          return of({ status: 200 }, asyncScheduler);
        } else
          return throwError({ status: updateError }, asyncScheduler);
      },
      addOperator() {
        if (addError != 200) {
          return throwError({ status: addError }, asyncScheduler);
        } else {
          return of({ status: 200 }, asyncScheduler);
        }
      },
      getOpByUsername () {
        if (newOperator.username == "nonExistentUsername") {
          return throwError({ status: 404 }, asyncScheduler);
        } else {
          return of(newOperator, asyncScheduler);
        }
      }
    }

    mockToastrService = jasmine.createSpyObj(['success', 'error', 'info', 'warning']);

    spyOn(mockUserService, 'getOperators').and.callThrough();
    spyOn(mockUserService, 'updateOperator').and.callThrough();
    spyOn(mockUserService, 'addOperator').and.callThrough();

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
        BrowserAnimationsModule
        //HttpClientModule,
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastrService }
      ],
      declarations: [OperatorListComponent, FakeNavBarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    // fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorListComponent);
    component = fixture.componentInstance;
  });

  it('should be created', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(mockUserService.getOperators).toHaveBeenCalled();
  }));

  it('should check users length when there are some operators', fakeAsync(() => {
    emptyUserList = false;
    fixture.detectChanges();
    tick();

    expect(mockUserService.getOperators).toHaveBeenCalled();
  }));

  it('should block operator', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.blockOperator(dbOperators[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getOperators).toHaveBeenCalled();
    expect(mockUserService.updateOperator).toHaveBeenCalled();

  }));

  it('should NOT block operator -> unknown operator', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.blockOperator(newOperator);

    tick();
    fixture.detectChanges();

    expect(mockToastrService.warning).toHaveBeenCalled();

  }));

  it('should NOT block operator -> non existent id', fakeAsync(() => {
    updateError = 404;
    fixture.detectChanges();
    tick();

    component.blockOperator(dbOperators[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getOperators).toHaveBeenCalled();
    expect(mockUserService.updateOperator).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should NOT update operator -> wrong user type', fakeAsync(() => {
    updateError = 409;
    fixture.detectChanges();
    tick();

    component.newUser = existingUser;
    component.addOperator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getOperators).toHaveBeenCalled();
    expect(mockUserService.updateOperator).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));


  it('should add operator', fakeAsync(() => {
    addError = 200;
    fixture.detectChanges();
    tick();

    component.newUser = newOperator;
    component.table = tableMockComponent;
    component.addOperator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getOperators).toHaveBeenCalled();
    expect(mockUserService.addOperator).toHaveBeenCalled();

  }));

  it('should NOT add operator -> invalid username error', fakeAsync(() => {
    addError = 200;
    fixture.detectChanges();
    tick();

    newOperator.username = "nonExistentUsername";
    component.newUser = newOperator;
    component.addOperator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getOperators).toHaveBeenCalled();
    expect(mockUserService.addOperator).toHaveBeenCalled();

  }));

  it('should NOT add operator -> non existent id', fakeAsync(() => {
    addError = 404;
    fixture.detectChanges();
    tick();

    component.newUser = newOperator;
    component.addOperator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getOperators).toHaveBeenCalled();
    expect(mockUserService.addOperator).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should NOT add operator -> wrong user type', fakeAsync(() => {
    addError = 409;
    fixture.detectChanges();
    tick();

    component.newUser = newOperator;
    component.addOperator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getOperators).toHaveBeenCalled();
    expect(mockUserService.addOperator).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should update operator', fakeAsync(() => {
    updateError = 200;
    fixture.detectChanges();
    tick();

    component.newUser = existingUser;
    component.addOperator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getOperators).toHaveBeenCalled();
    expect(mockUserService.updateOperator).toHaveBeenCalled();

  }));

  it('should NOT update operator -> non-existing id', fakeAsync(() => {
    updateError = 404;
    fixture.detectChanges();
    tick();

    component.newUser = existingUser;
    component.addOperator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getOperators).toHaveBeenCalled();
    expect(mockUserService.updateOperator).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));


  it('should show adding form', fakeAsync(() => {
    updateError = 404;
    fixture.detectChanges();
    tick();

    component.showForm();

    tick();
    fixture.detectChanges();

    expect(component.formShowed).toBeTruthy();
  }));

  it('should show change form', fakeAsync(() => {
    updateError = 404;
    fixture.detectChanges();
    tick();

    component.showChangeForm(dbOperators[1]);

    tick();
    fixture.detectChanges();

    expect(component.formShowed).toBeTruthy();
    expect(component.newUser).toBe(dbOperators[1]);
  }));
});
