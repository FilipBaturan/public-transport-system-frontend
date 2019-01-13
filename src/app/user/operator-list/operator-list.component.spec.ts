import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorListComponent } from './operator-list.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatCheckboxModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
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

describe('OperatorListComponent', () => {
  let component: OperatorListComponent;
  let fixture: ComponentFixture<OperatorListComponent>;

  let mockToastrService: any;

  beforeEach(async(() => {
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
        BrowserAnimationsModule,
        HttpClientModule,
      ],
      providers: [
        { provide: ToastrService, useValue: mockToastrService }
      ],
      declarations: [ OperatorListComponent, FakeNavBarComponent ],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
