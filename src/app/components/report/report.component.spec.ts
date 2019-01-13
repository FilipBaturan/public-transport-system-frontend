import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ReportComponent } from './report.component';
import { ReportService } from 'src/app/core/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { MatCheckboxModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, asyncScheduler, throwError } from 'rxjs';


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

  let reportError : boolean;
  let weeklyDataError : boolean;
  let monthlyDataError: boolean;

  beforeEach(fakeAsync(() => {

    reportError = false;
    weeklyDataError = false;
    monthlyDataError = false;
   
    mockReportService = {
      getReport(){
        if (reportError) {
          return throwError({status: 404}, asyncScheduler);
        }else {
          return of({status: 200}, asyncScheduler);
        }
      },
      getVisitsPerWeek(){
        if (weeklyDataError) {
          return throwError({status: 404}, asyncScheduler);
        }else {
          return of({"2019-01-07T00:00:00,2019-01-14T00:00:00": 2}, asyncScheduler);
        }
      },
      getVisitsPerMonth(){
        if (monthlyDataError) {
          return throwError({status: 404}, asyncScheduler);
        }else {
          return of({"2019-JANUARY": 1}, asyncScheduler);
        }
      }
    }

    mockToastrService = jasmine.createSpyObj(['error', 'info']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
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
      declarations: [
        ReportComponent,
        FakeNavBarComponent
      ],
      providers: [
        { provide: ReportService, useValue: mockReportService },
        { provide: ToastrService, useValue: mockToastrService }
      ],
      schemas:[NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    tick();
    expect(component).toBeTruthy();
  }));

  it('should throw an error because start date is not valid', fakeAsync(() => {
    tick();

    component.startDate = null;
    component.getPricePerPeriod();

    tick();
    fixture.detectChanges();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should throw an error because end date is not valid', fakeAsync(() => {
    tick();

    component.endDate = null;
    component.getPricePerPeriod();

    tick();
    fixture.detectChanges();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should throw an error because end date before start date', fakeAsync(() => {
    tick();

    component.endDate = "2018-01-01";
    component.startDate = "2018-12-12";

    component.getPricePerPeriod();

    tick();
    fixture.detectChanges();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should throw an error because unvalid date format', fakeAsync(() => {
    tick();

    component.startDate = "2018-01-01";
    component.endDate = "2018-12-12";
    reportError = true;

    component.getPricePerPeriod();

    tick();
    fixture.detectChanges();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should throw an error because unvalid date format -> get weekly report', fakeAsync(() => {
    tick();

    component.startDate = "2018-01-01";
    component.endDate = "2018-12-12";
    weeklyDataError = true;

    component.getPricePerPeriod();

    tick();
    fixture.detectChanges();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should return a valid report', fakeAsync(() => {
    tick();

    component.startDate = "2018-01-01";
    component.endDate = "2018-12-12";

    component.getPricePerPeriod();

    tick();
    fixture.detectChanges();
  }));
});
