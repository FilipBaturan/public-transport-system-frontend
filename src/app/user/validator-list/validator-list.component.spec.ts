import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatDatepickerModule, MatNativeDateModule, MatCheckboxModule, MatCardModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ValidatorListComponent } from './validator-list.component';
import { User } from '../../model/users/user.model';
import { of, asyncScheduler, throwError } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('ValidatorListComponent', () => {
  let component: ValidatorListComponent;
  let fixture: ComponentFixture<ValidatorListComponent>;

  let mockUserService: any;
  let mockToastrService: any;
  let tableMockComponent: any;

  let dbValidators : User[];
  let emptyUserList: boolean;

  let updateError : number;
  let addError : number;

  let newValidator : User;
  let existingUser: User;

  beforeEach(fakeAsync(() => {

    emptyUserList = true;
    updateError = 200;
    addError = 200;

    newValidator = new User(null, "new User Name", "new Pass", "new Name", "new Last Name",
     "new Email",  true, "123123");

    existingUser = new User(2, "un2", "222", "Name2", "Lastname2", "email2", true, "2222");

    dbValidators = [
      new User(1, "un1", "111", "Name1", "Lastname1", "email1", true, "1111"),
      new User(2, "un2", "222", "Name2", "Lastname2", "email2", true, "2222"),
      new User(3, "un3", "333", "Name3", "Lastname3", "email3", true, "3333"),
      new User(4, "un4", "444", "Name4", "Lastname4", "email4", true, "4444"),
      new User(5, "un5", "555", "Name5", "Lastname5", "email5", true, "5555"),
    ];

    tableMockComponent = {
      renderRows(){
        return "";
      }
    }

    mockUserService = {
      getValidators() {
        if (emptyUserList) {
          return of([], asyncScheduler);
        }else {
          return of(dbValidators, asyncScheduler);
        }
      },
      updateValidator(){
        if (updateError == 200) {
          return of({status: 200}, asyncScheduler);
        }else 
          return throwError({status: updateError}, asyncScheduler);
      },
      addValidator(){
        if (addError != 200) {
          return throwError({status: addError}, asyncScheduler);
        }else {
          return of({status: 200}, asyncScheduler);
        }
      },
      getByUsername(){
        if (newValidator.username == "nonExistentUsername") {
          return throwError({status: 404}, asyncScheduler);
        }else {
          return of(newValidator, asyncScheduler);
        }
      }
    }

    spyOn(mockUserService, 'getValidators').and.callThrough();
    spyOn(mockUserService, 'updateValidator').and.callThrough();
    spyOn(mockUserService, 'addValidator').and.callThrough();
   
    
    mockToastrService = jasmine.createSpyObj(['success', 'error', 'info', 'warning']);


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
      ],
      declarations: [ ValidatorListComponent, FakeNavBarComponent ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastrService }
      ],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorListComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(mockUserService.getValidators).toHaveBeenCalled();
  }));


  it('should check users length when there are some validators', fakeAsync(() => {
    emptyUserList = false;
    fixture.detectChanges();
    tick();

    expect(mockUserService.getValidators).toHaveBeenCalled();
  }));

  it('should block validator', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.blockValidator(dbValidators[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getValidators).toHaveBeenCalled();
    expect(mockUserService.updateValidator).toHaveBeenCalled();

  }));

  it('should NOT block validator -> unknown validator', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.blockValidator(newValidator);

    tick();
    fixture.detectChanges();

    expect(mockToastrService.warning).toHaveBeenCalled();

  }));

  it('should NOT block validator -> non existent id', fakeAsync(() => {
    updateError = 404;
    fixture.detectChanges();
    tick();

    component.blockValidator(dbValidators[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getValidators).toHaveBeenCalled();
    expect(mockUserService.updateValidator).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should NOT block validator -> wrong user type', fakeAsync(() => {
    updateError = 409;
    fixture.detectChanges();
    tick();

    component.blockValidator(dbValidators[1]);

    tick();
    fixture.detectChanges();

    expect(mockUserService.getValidators).toHaveBeenCalled();
    expect(mockUserService.updateValidator).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should add validator', fakeAsync(() => {
    addError = 200;
    fixture.detectChanges();
    tick();

    component.newUser = newValidator;
    component.table = tableMockComponent;
    component.addValidator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getValidators).toHaveBeenCalled();
    expect(mockUserService.addValidator).toHaveBeenCalled();

  }));

  it('should NOT add validator -> invalid username error', fakeAsync(() => {
    addError = 200;
    fixture.detectChanges();
    tick();

    newValidator.username = "nonExistentUsername";
    component.newUser = newValidator;
    component.addValidator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getValidators).toHaveBeenCalled();
    expect(mockUserService.addValidator).toHaveBeenCalled();

  }));

  it('should NOT add validator -> non existent id', fakeAsync(() => {
    addError = 404;
    fixture.detectChanges();
    tick();

    component.newUser = newValidator;
    component.addValidator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getValidators).toHaveBeenCalled();
    expect(mockUserService.addValidator).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should NOT add validator -> wrong user type', fakeAsync(() => {
    addError = 409;
    fixture.detectChanges();
    tick();

    component.newUser = newValidator;
    component.addValidator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getValidators).toHaveBeenCalled();
    expect(mockUserService.addValidator).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should update validator', fakeAsync(() => {
    updateError = 200;
    fixture.detectChanges();
    tick();

    component.newUser = existingUser;
    component.addValidator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getValidators).toHaveBeenCalled();
    expect(mockUserService.updateValidator).toHaveBeenCalled();

  }));

  it('should NOT update validator -> non existing id', fakeAsync(() => {
    updateError = 404;
    fixture.detectChanges();
    tick();

    component.newUser = existingUser;
    component.addValidator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getValidators).toHaveBeenCalled();
    expect(mockUserService.updateValidator).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should NOT update validator -> wrong user type', fakeAsync(() => {
    updateError = 409;
    fixture.detectChanges();
    tick();

    component.newUser = existingUser;
    component.addValidator();

    tick();
    fixture.detectChanges();

    expect(mockUserService.getValidators).toHaveBeenCalled();
    expect(mockUserService.updateValidator).toHaveBeenCalled();
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

    component.showChangeForm(dbValidators[1]);

    tick();
    fixture.detectChanges();

    expect(component.formShowed).toBeTruthy();
    expect(component.newUser).toBe(dbValidators[1]);
  }));
  
});
