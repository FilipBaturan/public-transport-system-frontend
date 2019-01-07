import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { RegUserListComponent } from './reg-user-list.component';
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

describe('RegUserListComponent', () => {
  let component: RegUserListComponent;
  let fixture: ComponentFixture<RegUserListComponent>;

  let mockUserService: any;

  beforeEach(async(() => {
    mockUserService = jasmine.createSpyObj(['']);

    TestBed.configureTestingModule({
      declarations: [
        RegUserListComponent,
        FakeNavBarComponent
      ],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegUserListComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
