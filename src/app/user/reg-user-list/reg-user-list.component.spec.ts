import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegUserListComponent } from './reg-user-list.component';

describe('RegUserListComponent', () => {
  let component: RegUserListComponent;
  let fixture: ComponentFixture<RegUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
