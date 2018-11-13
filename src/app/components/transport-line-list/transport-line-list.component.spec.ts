import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportLineListComponent } from './transport-line-list.component';

describe('TransportLineListComponent', () => {
  let component: TransportLineListComponent;
  let fixture: ComponentFixture<TransportLineListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportLineListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportLineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
