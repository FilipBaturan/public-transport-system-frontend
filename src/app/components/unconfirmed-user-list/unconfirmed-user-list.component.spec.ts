import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnconfirmedUserListComponent } from './unconfirmed-user-list.component';

describe('UnconfirmedUserListComponent', () => {
  let component: UnconfirmedUserListComponent;
  let fixture: ComponentFixture<UnconfirmedUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnconfirmedUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnconfirmedUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
