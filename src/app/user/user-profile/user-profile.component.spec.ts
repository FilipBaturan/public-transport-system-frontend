import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserProfileComponent } from './user-profile.component';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from 'src/app/core/services/upload.service';
import { throwError, asyncScheduler, of } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  let mockUserService: any;
  let mockUploadService: any;
  let mockToastrService: any;

  let serverError: boolean;
  let uploadError: boolean;

  beforeEach(async(() => {
    serverError = false;
    uploadError = false;

    mockUserService = {
      isAuthenticated() { return true; },
      getUser() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          return of({
            id: 1, firstName: 'null', lastName: 'null', email: 'null',
            username: 'null', password: 'null', telephone: 'null', active: true
          }, asyncScheduler);
        }
      },
      getImageFromUser() {
          return of ({id: 1, image: 'test.png'}, asyncScheduler);
      },
      update() { return of ([], asyncScheduler); }
    };

    mockUploadService = {
      getImage() {
        if (uploadError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          return of('', asyncScheduler);
        }
      }
    };

    spyOn(mockUserService, 'isAuthenticated').and.callThrough();
    spyOn(mockUserService, 'getUser').and.callThrough();
    spyOn(mockUserService, 'getImageFromUser').and.callThrough();
    spyOn(mockUserService, 'update').and.callThrough();
    spyOn(mockUploadService, 'getImage').and.callThrough();
    mockToastrService = jasmine.createSpyObj(['success', 'warning', 'error']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [ UserProfileComponent, FakeNavBarComponent ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: UploadService, useValue: mockUploadService }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    component.user = {
      id: null, firstName: 'null', lastName: 'null', email: 'null',
      username: 'null', password: 'null', telephone: 'null', active: true
    };
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(mockUserService.getUser).toHaveBeenCalled();
    expect(mockUserService.getImageFromUser).toHaveBeenCalled();
    expect(mockUploadService.getImage).toHaveBeenCalled();
  }));

  it('should receive server error', fakeAsync(() => {
    serverError = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));

  it('should receive server error', fakeAsync(() => {
    uploadError = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(mockUserService.getUser).toHaveBeenCalled();
    expect(mockUserService.getImageFromUser).toHaveBeenCalled();
    expect(mockUploadService.getImage).toHaveBeenCalled();
  }));

  it('should save changes', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    component.password = 'null';
    component.verify = 'null';
    component.saveChanges();
    tick();
    fixture.detectChanges();
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should not save changes because of invalid password', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    component.password = 'null';
    component.verify = 'none';

    component.saveChanges();
    expect(mockToastrService.warning).toHaveBeenCalled();
  }));

});
