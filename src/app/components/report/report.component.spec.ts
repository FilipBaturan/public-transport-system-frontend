import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ReportComponent } from './report.component';
import { ReportService } from 'src/app/core/services/report.service';
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

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  let mockReportService: any;
  let mockToastrService: any;

  beforeEach(async(() => {
    mockReportService = jasmine.createSpyObj(['']);
    mockToastrService = jasmine.createSpyObj(['']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        ReportComponent,
        FakeNavBarComponent
      ],
      providers: [
        { provide: ReportService, useValue: mockReportService },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
