import { TestBed, fakeAsync } from '@angular/core/testing';

import { ReportService } from './report.service';
import { VehicleType } from '../../model/enums/vehicle-type.model';
import { map } from 'rxjs/operators';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from './ticket.service';

describe('ReportService', () => {
  const url: string = '/api/ticket';
  let dbReport: any;

  let mockToastrService: any;
  let mockHttp: HttpTestingController;
  let service: ReportService;

  let startDate : string = "2016-01-01";
  let endDate : string = "2017-01-01";


  beforeEach(() => {
    
    dbReport = new Map<VehicleType, number>();
    dbReport[VehicleType.BUS] = 0;
    dbReport[VehicleType.METRO] = 600;
    dbReport[VehicleType.TRAM] = 150;


    mockToastrService = jasmine.createSpyObj(['success', 'error']);
    
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ToastrService, useValue: mockToastrService }
      ]
    });

    mockHttp = TestBed.get(HttpTestingController);
    service = TestBed.get(ReportService);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //Get tickets for user test
  it('should get all available users', fakeAsync(() => {
    service.getReport(startDate, endDate).subscribe(report => {
      expect(report).toBe(dbReport);
     
    });

    const req = mockHttp.expectOne(url + "/reprot/" + startDate + '/' + endDate + "/");
    expect(req.request.method).toBe('GET');
    req.flush(dbReport);
  }));

  it('should receive client side error', fakeAsync(() => {
    service.getReport(startDate, endDate).subscribe(() => { }, err => {
      expect(err).toBe('Client side error!');
    });

    const req = mockHttp.expectOne(url + "/reprot/" + startDate + '/' + endDate + "/");
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should receive server is down error', fakeAsync(() => {
    service.getReport(startDate, endDate).subscribe(() => { }, err => {
      expect(err).toBe('Server is down!');
    });

    const req = mockHttp.expectOne(url + "/reprot/" + startDate + '/' + endDate + "/");
    expect(req.request.method).toBe('GET');
    req.flush("Error occured", { status: 401, statusText: 'Unathorized' });
  }));

  it('should receive unathorized error', fakeAsync(() => {
    service.getReport(startDate, endDate).subscribe(() => { }, err => {
      expect(err).toBe("Unathorized");
    });

    const req = mockHttp.expectOne(url + "/reprot/" + startDate + '/' + endDate + "/");
    expect(req.request.method).toBe('GET');
    req.flush("Unathorized", { status: 403, statusText: 'Unathorized' });
  }));

  it('should receive date type error', fakeAsync(() => {
    service.getReport(startDate, endDate).subscribe(() => { }, err => {
      expect(err).toBe('Date type is not valid!');
    });

    const req = mockHttp.expectOne(url + "/reprot/" + startDate + '/' + endDate + "/");
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Date type is not valid!' },
      { status: 400, statusText: 'Bad Request' });
  }));

   //Get weekly report
   it('should get weekly report', fakeAsync(() => {
    service.getVisitsPerWeek(startDate, endDate).subscribe(report => {
      expect(report).toBe(dbReport);
     
    });

    const req = mockHttp.expectOne(url + "/getVisitsPerWeek/" + startDate + '/' + endDate + "/");
    expect(req.request.method).toBe('GET');
    req.flush(dbReport);
  }));

   //Get monthly report
   it('should get monthly report', fakeAsync(() => {
    service.getVisitsPerMonth(startDate, endDate).subscribe(report => {
      expect(report).toBe(dbReport);
     
    });

    const req = mockHttp.expectOne(url + "/getVisitsPerMonth/" + startDate + '/' + endDate + "/");
    expect(req.request.method).toBe('GET');
    req.flush(dbReport);
  }));

});
