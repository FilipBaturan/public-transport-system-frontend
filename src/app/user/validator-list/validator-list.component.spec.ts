import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorListComponent } from './validator-list.component';

describe('ValidatorListComponent', () => {
  let component: ValidatorListComponent;
  let fixture: ComponentFixture<ValidatorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
