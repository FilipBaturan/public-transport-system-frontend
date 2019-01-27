import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { throwError, asyncScheduler, of } from 'rxjs';
import { MatCheckboxModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';

import { ScheduleComponent } from './schedule.component';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { TransportLine } from 'src/app/model/transport-line.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { Schedule } from 'src/app/model/schedule.model';
import { DayOfWeek } from 'src/app/model/enums/day-of-week.model';


@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('ScheduleComponent', () => {
    let component: ScheduleComponent;
    let fixture: ComponentFixture<ScheduleComponent>;

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


    let dbSchedules: Schedule[];
    let dbTransportLines: TransportLine[];

    let serverError: boolean;
    let empty: boolean;

    let selectedId: number;

  beforeEach(() => {

    serverError = false;
    empty = false;

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
        findScheduleByTrLineIdAndDayOfWeek(){
            let s1 = {id:100, departures:["08:00","08:15","08:30","08:45","09:00"],
                transportLine:transportLine1, dayOfWeek: "WORKDAY", active:true
            }
                
            let s2 = {id:101, departures:["10:00","10:15","10:30","10:45","11:00","11:15"],
                transportLine:transportLine2, dayOfWeek: "WORKDAY", active:true
            }

            if (selectedId == 1){
                return of( s1, asyncScheduler);
            }
            else if (selectedId == 2){
                return of( s2, asyncScheduler);
            } else{
                return throwError({ status: 400 }, asyncScheduler);
            }
        }
    };
        

    spyOn(mockTransportLineService, 'findAll').and.callThrough();
    spyOn(mockScheduleService, 'findScheduleByTrLineIdAndDayOfWeek').and.callThrough();

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
        ScheduleComponent,
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
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
  }));

  it ('should not select an item -> workday not selected', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let item = {"id": 1, "itemName": "R1"};
    component.onItemSelect(item);

    expect(mockToastrService.info).toHaveBeenCalled();
    expect(component.selectedItems.length).toEqual(0);

  }));


  it ('should not select an item -> schedule doesnt exist', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.dayOfWeekDropdown.length).toEqual(3);

    let dowItem = {"id": 1, "itemName": "Workday"};
    component.selectedItem.push(dowItem);
    component.onDayOfWeekSelect(dowItem);
    tick();
    fixture.detectChanges();

    expect(component.columnsToDisplay.length).toEqual(0);
    expect(component.selectedItems.length).toEqual(0);
    expect(component.selectedItem.length).toEqual(1);
    
    let item = {"id": 11111, "itemName": "R1"};
    component.onItemSelect(item);
    tick();
    fixture.detectChanges();
    expect(component.selectedItems.length).toEqual(0);

  }));


  it ('should select and then deselect an item and then deselect a workday', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(component.dayOfWeekDropdown.length).toEqual(3);

    let dowItem = {"id": 1, "itemName": "Workday"};
    component.selectedItem.push(dowItem);
    component.onDayOfWeekSelect(dowItem);
    tick();
    fixture.detectChanges();

    expect(component.columnsToDisplay.length).toEqual(0);
    expect(component.selectedItems.length).toEqual(0);
    expect(component.selectedItem.length).toEqual(1);
    //expect(component.tableArr.length).toEqual(0);

    let item = {"id": 1, "itemName": "R1"};
    selectedId = 1;
    component.selectedItems.push(item);
    component.onItemSelect(item);
    tick();
    fixture.detectChanges();
    expect(component.selectedItems.length).toEqual(1);

    let item1 = {"id": 2, "itemName": "R2"};
    selectedId = 2;
    component.selectedItems.push(item1);
    component.onItemSelect(item1);
    tick();
    fixture.detectChanges();
    expect(component.selectedItems.length).toEqual(2);

    let l = component.columnsToDisplay.length;
    component.onItemDeSelect(item1);
    tick();
    fixture.detectChanges();
    expect(component.columnsToDisplay.length).toEqual(l-1);

    component.onDayOfWeekDeSelect(dowItem);
    tick();
    fixture.detectChanges();
    expect(component.columnsToDisplay.length).toEqual(0);
    expect(component.selectedItems.length).toEqual(0);
  }));

});