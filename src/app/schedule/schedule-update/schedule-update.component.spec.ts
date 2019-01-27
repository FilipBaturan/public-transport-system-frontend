import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ScheduleUpdateComponent } from './schedule-update.component';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TransportLine } from 'src/app/model/transport-line.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { Schedule } from 'src/app/model/schedule.model';
import { DayOfWeek } from 'src/app/model/enums/day-of-week.model';
import { throwError, asyncScheduler, of } from 'rxjs';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { ToastrService } from 'ngx-toastr';
import { ScheduleComponent } from '../schedule/schedule.component';

@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('ScheduleUpdateComponent', () => {
    let component: ScheduleUpdateComponent;
    let fixture: ComponentFixture<ScheduleUpdateComponent>;

    let mockScheduleService: any;
    let mockTransportLineService: any;
    let mockToastrService: any;

    const transportLine1:TransportLine={id: 1, name: 'R1',
            positions: { id: 1, content: '73 17', active: true },
            schedule: [], active: true, type: VehicleType.BUS, zone: 1};

    let transportLine2:TransportLine;
    let transportLine3:TransportLine;
    let transportLine4:TransportLine;

    const newTransportLine:TransportLine = {id: 7, name: 'T7',
        positions: { id: 7, content: '73 17', active: true },
        schedule: [], active: true, type: VehicleType.BUS, zone: 1}
    const newSchedule: Schedule = {id:111, departures:["08:00","08:15","08:30","08:45","09:00"],
        transportLine:transportLine4, dayOfWeek: DayOfWeek.WORKDAY, active:true};


    let dbSchedules: any[];
    let dbTransportLines: TransportLine[];

    let serverError: boolean;
    let unknownId: boolean;

    let selectedId: number;

  beforeEach(() => {

    serverError = false;
    unknownId = false;

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
                transportLine:transportLine1, dayOfWeek: "WORKDAY", active:true
            },
            {id:101, departures:["10:00","10:15","10:30","10:45","11:00","11:15"],
                transportLine:transportLine1, dayOfWeek: "SATURDAY", active:true
            },
            {id:102, departures:["13:00","13:15","13:30","13:45","13:00","13:15","13:30","13:45"],
                transportLine:transportLine1, dayOfWeek: "SUNDAY", active:true
            },{id:104, departures:["19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45"],
            transportLine:transportLine2, dayOfWeek: "WORKDAY", active:true
        }
        ];

        dbTransportLines = [transportLine1, transportLine2, transportLine3];

    mockScheduleService = jasmine.createSpyObj(['']);
    mockToastrService = jasmine.createSpyObj(['success', 'error', 'info', 'warning']);
    
    mockTransportLineService = {
        findAll() {
          if (serverError) {
            return throwError({ status: 503 }, asyncScheduler);
          } else {
            return of(dbTransportLines, asyncScheduler);
          }
        }
    };


    mockScheduleService = {
        findAll() {
          if (serverError) {
            return throwError({ status: 503 }, asyncScheduler);
          } else {
            return of(dbSchedules, asyncScheduler);
          }
        },
        findScheduleByTransportLineId(){
            let s1 = {id:100, departures:["08:00","08:15","08:30","08:45","09:00"],
                transportLine:transportLine1, dayOfWeek: "WORKDAY", active:true
            }
                
            let s2 = {id:101, departures:["10:00","10:15","10:30","10:45","11:00","11:15"],
                transportLine:transportLine1, dayOfWeek: "SATURDAY", active:true
            }

            let s3 = {id:102, departures:["13:00","13:15","13:30","13:45","14:00"],
                transportLine:transportLine1, dayOfWeek: "SUNDAY", active:true
            }

            let s4 = {id:103, departures:["15:00","15:15","15:30","15:45","16:00"],
                transportLine:transportLine2, dayOfWeek: "WORKDAY", active:true
            }

            if (selectedId == 1){
                return of( [s1,s2,s3], asyncScheduler);
            }
            else if (selectedId == 2){
                return of( [s4], asyncScheduler);
            } else{
                return throwError({ status: 400 }, asyncScheduler);
            }
        },updateSchedule(){
            if (!unknownId)
                return of(true, asyncScheduler);
            else
                return throwError({ status: 400 }, asyncScheduler);
        },create(){
            let s = {id:103, departures:["15:00","15:15","15:30","15:45","16:00"],
                transportLine:transportLine2, dayOfWeek: "WORKDAY", active:true
            }

            if (!unknownId)
                return of(s, asyncScheduler);
            else
                return throwError({ status: 400 }, asyncScheduler);
        }  
    };
        

    spyOn(mockTransportLineService, 'findAll').and.callThrough();
    spyOn(mockScheduleService, 'findScheduleByTransportLineId').and.callThrough();
    spyOn(mockScheduleService, 'updateSchedule').and.callThrough();
    spyOn(mockScheduleService, 'create').and.callThrough();


    TestBed.configureTestingModule({
      imports: [
        AngularMultiSelectModule,
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
        ScheduleUpdateComponent,
        FakeNavBarComponent
      ],
      providers: [
        { provide: ScheduleService, useValue: mockScheduleService },
        { provide: TransportLineService, useValue: mockTransportLineService },
        { provide: ToastrService, useValue: mockToastrService }
      ],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleUpdateComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
  }));

  it ('should select an item and display 1-3 schedules', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let item = {"id": 1, "itemName": "R1"};
    selectedId = 1;
    component.selectedItems.push(item);
    component.onItemSelect(item);
    tick();
    fixture.detectChanges();
    expect(component.selectedItems.length).toEqual(1);
    expect(component.columnsToDisplay.length).toEqual(3);
    expect(component.displayedSchedules.length).toEqual(3);

    component.onItemDeSelect(item);
    tick();
    fixture.detectChanges();
    expect(component.columnsToDisplay.length).toEqual(0);
  }));


  it ('should update selected schedules', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let item = {"id": 1, "itemName": "R1"};
    selectedId = 1;
    component.selectedItems.push(item);
    component.onItemSelect(item);
    tick();
    fixture.detectChanges();
    expect(component.selectedItems.length).toEqual(1);
    expect(component.columnsToDisplay.length).toEqual(3);
    expect(component.displayedSchedules.length).toEqual(3);

    component.updateSchedule();
    tick();
    fixture.detectChanges();
    expect(mockScheduleService.updateSchedule).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
  }));


  /*it ('should not update selected schedules', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    unknownId = true;
    let item = {"id": 11111, "itemName": "Z1"};
    selectedId = 1;
    component.selectedItems.push(item);
    component.onItemSelect(item);
    tick();
    fixture.detectChanges();
    expect(component.selectedItems.length).toEqual(0);
    expect(component.columnsToDisplay.length).toEqual(0);
    expect(component.displayedSchedules.length).toEqual(0);

    component.updateSchedule();
    tick();
    fixture.detectChanges();
    expect(mockScheduleService.updateSchedule).toThrowError();
    expect(mockToastrService.warning).toHaveBeenCalled();
    unknownId = false;
  }));*/

  it ('should add a schedule', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let l1 = component.displayedSchedules.length
    let l2 = component.schedules.length

    let column = "R2-WORKDAY"
    component.addSchedule(column);
    tick();
    fixture.detectChanges();
    
    expect(mockScheduleService.create).toHaveBeenCalled();
    expect(component.displayedSchedules.length).toEqual(l1+1);
    expect(component.schedules.length).toEqual(l2+1);
    expect(mockToastrService.success).toHaveBeenCalled();
  }));


  it ('should not add a schedule -> transport line doesnt exist', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let l1 = component.displayedSchedules.length
    let l2 = component.schedules.length

    let column = "R55-WORKDAY"
    component.addSchedule(column);
    tick();
    fixture.detectChanges();
    
    expect(component.displayedSchedules.length).toEqual(l1);
    expect(component.schedules.length).toEqual(l2);
    expect(mockToastrService.warning).toHaveBeenCalled();
  }));


  it ('should not add a schedule -> schedule already exists', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let l1 = component.displayedSchedules.length
    let l2 = component.schedules.length

    unknownId = true;
    let column = "R1-WORKDAY"
    component.addSchedule(column);
    tick();
    fixture.detectChanges();

    //expect(mockScheduleService.create).toThrowError();
    expect(component.displayedSchedules.length).toEqual(l1);
    expect(component.schedules.length).toEqual(l2);
    expect(mockToastrService.warning).toHaveBeenCalled();
    unknownId = false;
  }));


  it ('should remove a schedule', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let item = {"id": 2, "itemName": "R2"};
    selectedId = 2;
    component.selectedItems.push(item);
    component.onItemSelect(item);
    tick();
    fixture.detectChanges();
    expect(component.selectedItems.length).toEqual(1);
    expect(component.displayedSchedules.length).toEqual(1);

    let l1 = component.displayedSchedules.length;

    let column = "R2-WORKDAY";
    component.removeSchedule(column);
    tick();
    fixture.detectChanges();
    expect(mockScheduleService.updateSchedule).toHaveBeenCalled();
    expect(component.displayedSchedules.length).toEqual(l1-1);
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it ('should not remove a schedule -> schedule doesnt exist', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let l1 = component.displayedSchedules.length;

    let column = "R55-WORKDAY";
    component.removeSchedule(column);
    tick();
    fixture.detectChanges();
    expect(component.displayedSchedules.length).toEqual(l1);
    expect(mockToastrService.warning).toHaveBeenCalled();
  }));

  it ('should add a row', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let item = {"id": 1, "itemName": "R1"};
    selectedId = 1;
    component.selectedItems.push(item);
    component.onItemSelect(item);
    tick();
    fixture.detectChanges();

    let l1 = component.tableArr.length;

    component.addNewRow();
    tick();
    fixture.detectChanges();
    expect(component.tableArr.length).toEqual(l1+1);
  }));


  it ('should remove a row', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let item = {"id": 1, "itemName": "R1"};
    selectedId = 1;
    component.selectedItems.push(item);
    component.onItemSelect(item);
    tick();
    fixture.detectChanges();

    component.addNewRow();
    tick();
    fixture.detectChanges();
    component.addNewRow();
    tick();
    fixture.detectChanges();
    
    let l1 = component.tableArr.length;
    component.removeRow();
    tick();
    fixture.detectChanges();
    
    expect(component.tableArr.length).toEqual(l1-1);
  }));


  it ('should check a departure', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let column = "R1-WORKDAY";
    let element = {"R1-WORKDAY": ""};
    let departure = element[column];
    let res = component.checkDeparture(departure, element, column);
    tick();
    fixture.detectChanges();
    expect(res).toEqual(true);

    column = "R1-WORKDAY";
    element = {"R1-WORKDAY": "15:55"};
    departure = element[column];
    res = component.checkDeparture(departure, element, column);
    tick();
    fixture.detectChanges();
    expect(res).toEqual(true);

    column = "R1-WORKDAY";
    element = {"R1-WORKDAY": "15-555"};
    departure = element[column];
    res = component.checkDeparture(departure, element, column);
    tick();
    fixture.detectChanges();
    expect(res).toEqual(false);
    expect(mockToastrService.warning).toHaveBeenCalled();

    column = "R1-WORKDAY";
    element = {"R1-WORKDAY": "42:42"};
    departure = element[column];
    res = component.checkDeparture(departure, element, column);
    tick();
    fixture.detectChanges();
    expect(res).toEqual(false);
    expect(mockToastrService.warning).toHaveBeenCalled();
  }));
});
