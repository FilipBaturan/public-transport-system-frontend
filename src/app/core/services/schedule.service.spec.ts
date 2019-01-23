import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ScheduleService } from './schedule.service';
import { Schedule } from 'src/app/model/schedule.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { DayOfWeek } from 'src/app/model/enums/day-of-week.model';
import { HttpResponse } from '@angular/common/http';

describe('ScheduleService', () => {
    const url: string = '/api/schedule/';

    const transportLine1:TransportLine={id: 1, name: 'R1',
        positions: { id: 1, content: '73 17', active: true },
        schedule: [], active: true, type: VehicleType.BUS, zone: 1};

    let transportLine2:TransportLine;
    let transportLine3:TransportLine;
    let transportLine4:TransportLine;

    let mockToastrService: any;

    const newTransportLine:TransportLine = {id: 7, name: 'T7',
        positions: { id: 7, content: '73 17', active: true },
        schedule: [], active: true, type: VehicleType.BUS, zone: 1}
    const newSchedule: Schedule = {id:111, departures:["08:00","08:15","08:30","08:45","09:00"],
        transportLine:transportLine4, dayOfWeek: DayOfWeek.WORKDAY, active:true};
    
    
    let dbSchedules: Schedule[];
    
    let mockHttp: HttpTestingController;
    let service: ScheduleService;

    beforeEach(() =>{
        
        transportLine2 = {id: 2, name: 'R2',
            positions: { id: 1, content: '73 17', active: true },
            schedule: [], active: true, type: VehicleType.BUS, zone: 1
        }

        transportLine3 = {id: 3, name: 'R3',
            positions: { id: 1, content: '73 17', active: true },
            schedule: [], active: true, type: VehicleType.BUS, zone: 1
        }

        transportLine4 = {id: 4, name: 'R4',
            positions: { id: 1, content: '73 17', active: true },
            schedule: [], active: true, type: VehicleType.BUS, zone: 1
        }

        dbSchedules = [
            {id:100, departures:["08:00","08:15","08:30","08:45","09:00"],
                transportLine:transportLine1, dayOfWeek: DayOfWeek.WORKDAY, active:true
            },
            {id:101, departures:["10:00","10:15","10:30","10:45","11:00","11:15"],
                transportLine:transportLine2, dayOfWeek: DayOfWeek.WORKDAY, active:true
            },
            {id:102, departures:["13:00","13:15","13:30","13:45","13:00","13:15","13:30","13:45"],
                transportLine:transportLine3, dayOfWeek: DayOfWeek.WORKDAY, active:true
            }
        ];

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
        service = TestBed.get(ScheduleService);
    })

    afterEach(() => {
        mockHttp.verify();
      });


    it('should be created', () => {
        //service = TestBed.get(ScheduleService);
        expect(service).toBeTruthy();
    });


    it('should get all available schedules', fakeAsync(() => {
        service.findAll().subscribe(schedules => {
          expect(schedules.length).toBe(dbSchedules.length);
          expect(schedules[0]).toEqual(dbSchedules[0]);
          expect(schedules[3]).toEqual(dbSchedules[3]);
          expect(schedules[5]).toEqual(dbSchedules[5]);
        });
        const req = mockHttp.expectOne(url);
        expect(req.request.method).toBe('GET');
        req.flush(dbSchedules);
      }));


      it('should receive client side error', fakeAsync(() => {
        service.findAll().subscribe(() => { }, err => {
          expect(err).toBe('Internal Server Error');
        });
    
        const req = mockHttp.expectOne(url);
        expect(req.request.method).toBe('GET');
        req.flush(null, { status: 500, statusText: 'Internal Server Error' });
      }));


      /*it('should create a schedule', fakeAsync(() => {
        service.create(newSchedule).subscribe(schedule => {
          expect(schedule.id).toEqual(newSchedule.id);
          expect(schedule.name).toEqual(newSchedule.transportLine.name);
          expect(schedule.active).toEqual(newSchedule.active);
        });

        const req = mockHttp.expectOne(url);
        expect(req.request.method).toBe('POST');
        req.flush(newSchedule);
      }));*/


      it('should not create a schedule', fakeAsync(() => {
        let invalidScheduleToCreate = {id:222, departures:["08:00","08:15","08:30","08:45","09:00"],
            transportLine:transportLine1, dayOfWeek: DayOfWeek.WORKDAY, active:true
        }

        service.create(invalidScheduleToCreate).subscribe(schedule => {
          expect(schedule.id).toEqual(222);
        });

        const req = mockHttp.expectOne(url);
        expect(req.request.method).toBe('POST');
        req.flush(invalidScheduleToCreate);
      }));


      it('should update a schedule', fakeAsync(() => {
        let toUpdate = [dbSchedules[0]] as Schedule[];
        service.updateSchedule(toUpdate).subscribe(bool => {
          expect(bool).toEqual(true);
        });
        
        const req = mockHttp.expectOne(url+"updateSchedule/");
        expect(req.request.method).toBe('PUT');
        req.event(new HttpResponse<boolean>({body: true}));
      }));

      it('should not update a schedule', fakeAsync(() => {
        let schedulesToUpdate = [{id:222, departures:["08:00","08:15","08:30","08:45","09:00"],
            transportLine:transportLine1, dayOfWeek: DayOfWeek.WORKDAY, active:true
        }] as Schedule[];

        service.updateSchedule(schedulesToUpdate).subscribe(bool => {
          expect(bool).toEqual(false);
        });
        
        const req = mockHttp.expectOne(url+"updateSchedule/");
        expect(req.request.method).toBe('PUT');
        req.event(new HttpResponse<boolean>({body: false}));
      }));


      it('should find a schedule by transport line id', fakeAsync(() => {

        service.findScheduleByTransportLineId(transportLine1.id).subscribe(schedules => {
          expect(schedules.length).toEqual(3);
        });
        
        const req = mockHttp.expectOne(url+"findByTransportLineId/" + transportLine1.id);
        expect(req.request.method).toBe('GET');
        req.flush(dbSchedules);
      }));

      it('should not find a schedule by transport line id', fakeAsync(() => {
        let invalidTransportLine = {id: 444, name: 'R44',
            positions: { id: 1, content: '73 17', active: true },
            schedule: [], active: true, type: VehicleType.BUS, zone: 1
        }

        service.findScheduleByTransportLineId(invalidTransportLine.id).subscribe(schedules => {
          expect(schedules.length).toEqual(0);
        });
        
        const req = mockHttp.expectOne(url+"findByTransportLineId/" + invalidTransportLine.id);
        expect(req.request.method).toBe('GET');
        req.flush([]);
      }));

      it('should find a schedule by transport line id and day of week', fakeAsync(() => {

        service.findScheduleByTrLineIdAndDayOfWeek(transportLine1.id, DayOfWeek.WORKDAY.toString()).subscribe(schedule => {
          expect(schedule.id).toEqual(dbSchedules[0].id);
        });
        
        const req = mockHttp.expectOne(url+"findByTrLineIdAndDayOfWeek/" + transportLine1.id+"?dayOfWeek=" + DayOfWeek.WORKDAY.toString());
        expect(req.request.method).toBe('GET');
        req.flush(dbSchedules[0]);
      }));
      
});