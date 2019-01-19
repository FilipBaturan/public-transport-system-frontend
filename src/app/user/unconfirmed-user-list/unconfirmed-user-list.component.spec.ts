import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { asyncScheduler, of, throwError } from 'rxjs';
import { User } from '../../model/users/user.model';
import { MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatCardModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UnconfirmedUserListComponent } from './unconfirmed-user-list.component';


@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('UnconfirmedUserListComponent', () => {
  let mockUserService: any;
  let mockToastrService: any;

  let dbUnConfUsers : User[];
  let emptyUserList: boolean;
  let component: UnconfirmedUserListComponent;
  let fixture: ComponentFixture<UnconfirmedUserListComponent>;

  let denyError : number;
  let acceptError : number;

  beforeEach(fakeAsync(() => {

    emptyUserList = true;
    denyError = 200;
    acceptError = 200;

    dbUnConfUsers = [
      new User(1, "un1", "111", "Name1", "Lastname1", "email1", true, "1111"),
      new User(2, "un2", "222", "Name2", "Lastname2", "email2", true, "2222"),
      new User(3, "un3", "333", "Name3", "Lastname3", "email3", true, "3333"),
      new User(4, "un4", "444", "Name4", "Lastname4", "email4", true, "4444"),
      new User(5, "un5", "555", "Name5", "Lastname5", "email5", true, "5555"),
    ];

    mockUserService = {
      getUnconfirmedUsers() {
        if (emptyUserList) {
          return of([], asyncScheduler);
        }else {
          return of(dbUnConfUsers, asyncScheduler);
        }
      },
      acceptUser(){
        if (acceptError != 200) {
          return throwError({status: acceptError}, asyncScheduler);
        }else {
          return of({status: 200}, asyncScheduler);
        }
      },
      denyUser(){
        if (denyError != 200) {
          return throwError({ status: denyError }, asyncScheduler);
        }else {
          return of({status: 200}, asyncScheduler);
        }
      }
    }

    spyOn(mockUserService, 'getUnconfirmedUsers').and.callThrough();
    spyOn(mockUserService, 'acceptUser').and.callThrough();
    spyOn(mockUserService, 'denyUser').and.callThrough();
   
    
    mockToastrService = jasmine.createSpyObj(['success', 'error', 'info']);

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
      ],
      declarations: [ UnconfirmedUserListComponent, FakeNavBarComponent ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastrService }
      ],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(UnconfirmedUserListComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(mockUserService.getUnconfirmedUsers).toHaveBeenCalled();
  }));

  it('should check users length when there are some unconfirmed users', fakeAsync(() => {
    emptyUserList = false;
    fixture.detectChanges();
    tick();
  
    expect(mockUserService.getUnconfirmedUsers).toHaveBeenCalled();
  }));

  it('should deny user', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.denyUser(dbUnConfUsers[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getUnconfirmedUsers).toHaveBeenCalled();
    expect(mockUserService.denyUser).toHaveBeenCalled();
    expect(mockToastrService.info).toHaveBeenCalled();

  }));

  it('should NOT deny user -> user id does not exist', fakeAsync(() => {
    denyError = 404;
    fixture.detectChanges();
    tick();

    component.denyUser(dbUnConfUsers[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getUnconfirmedUsers).toHaveBeenCalled();
    expect(mockUserService.denyUser).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should NOT deny user -> invalid users data', fakeAsync(() => {
    denyError = 406;
    fixture.detectChanges();
    tick();

    component.denyUser(dbUnConfUsers[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getUnconfirmedUsers).toHaveBeenCalled();
    expect(mockUserService.denyUser).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should accept user', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.acceptUser(dbUnConfUsers[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getUnconfirmedUsers).toHaveBeenCalled();
    expect(mockUserService.acceptUser).toHaveBeenCalled();
    expect(mockToastrService.info).toHaveBeenCalled();

  }));

  it('should NOT accept user -> user id not found', fakeAsync(() => {
    acceptError = 404;
    fixture.detectChanges();
    tick();

    component.acceptUser(dbUnConfUsers[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getUnconfirmedUsers).toHaveBeenCalled();
    expect(mockUserService.acceptUser).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should NOT accept user -> invalid data for user', fakeAsync(() => {
    acceptError = 406;
    fixture.detectChanges();
    tick();

    component.acceptUser(dbUnConfUsers[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getUnconfirmedUsers).toHaveBeenCalled();
    expect(mockUserService.acceptUser).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

});
