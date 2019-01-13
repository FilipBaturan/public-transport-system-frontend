import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';

import { RegUserListComponent } from './reg-user-list.component';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { asyncScheduler, of } from 'rxjs';
import { User } from '../../model/users/user.model';
import { MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatCardModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('RegUserListComponent', () => {
  let component: RegUserListComponent;
  let fixture: ComponentFixture<RegUserListComponent>;

  let mockUserService: any;
  let mockToastrService: any;

  let dbRegUsers : User[];
  let emptyUserList: boolean;

  beforeEach(fakeAsync(() => {
    
    emptyUserList = true;

    dbRegUsers = [
      new User(1, "un1", "111", "Name1", "Lastname1", "email1", true, "1111"),
      new User(2, "un2", "222", "Name2", "Lastname2", "email2", true, "2222"),
      new User(3, "un3", "333", "Name3", "Lastname3", "email3", true, "3333"),
      new User(4, "un4", "444", "Name4", "Lastname4", "email4", true, "4444"),
      new User(5, "un5", "555", "Name5", "Lastname5", "email5", true, "5555"),
    ];

    mockUserService = {
      getRegUsers() {
        if (emptyUserList) {
          return of([], asyncScheduler);
        }else {
          return of(dbRegUsers, asyncScheduler);
        }
      },
    }

    spyOn(mockUserService, 'getRegUsers').and.callThrough();
   
    
    mockToastrService = jasmine.createSpyObj(['success', 'error']);


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
      declarations: [
        RegUserListComponent,
        FakeNavBarComponent
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastrService }
      ],
      schemas:[NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegUserListComponent);
    component = fixture.componentInstance;

  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(component.noUsers).toBeTruthy();
    expect(mockUserService.getRegUsers).toHaveBeenCalled();
  }));


  it('should check users length when there are some registered users', fakeAsync(() => {
    emptyUserList = false;
    fixture.detectChanges();
    tick();
   
    expect(component.noUsers).toBeTruthy();
    expect(mockUserService.getRegUsers).toHaveBeenCalled();
  }));
});
