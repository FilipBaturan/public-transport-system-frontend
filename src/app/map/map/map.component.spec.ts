import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MapComponent } from './map.component';
import { UserService } from 'src/app/core/services/user.service';
import { StationService } from 'src/app/core/services/station.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from 'src/app/core/services/map.service';
import { Station } from 'src/app/model/station.model';
import { throwError, asyncScheduler, of, observable } from 'rxjs';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { By } from '@angular/platform-browser';
import { TrackerService } from 'src/app/core/services/tracker.service';


@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  // mocks of services
  let mockUserService: any;
  let mockStationService: any;
  let mockTransportLineService: any;
  let mockToastrService: any;
  let mockMapService: any;
  let mockTrackerService: any;

  let serverError: boolean;
  let empty: boolean;

  let dbStations: Station[];
  let replacedStations: Station[];
  let dbTransportLines: TransportLine[];
  let replacedTransportLines: TransportLine[];
  let newTransportLine: TransportLine;

  beforeEach(async(() => {
    serverError = false;
    empty = false;

    dbStations = [
      { id: 1, name: 'S1', position: { id: 1, latitude: 45.23, longitude: 86.12, active: true }, type: VehicleType.BUS, active: true },
      { id: 2, name: 'S2', position: { id: 2, latitude: 14.72, longitude: 27.46, active: true }, type: VehicleType.METRO, active: true },
      { id: 3, name: 'S3', position: { id: 3, latitude: 73.96, longitude: 55.67, active: true }, type: VehicleType.TRAM, active: true },
      { id: 4, name: 'S4', position: { id: 4, latitude: 82.37, longitude: 43.58, active: true }, type: VehicleType.BUS, active: true },
      { id: 5, name: 'S5', position: { id: 5, latitude: 93.16, longitude: 71.35, active: true }, type: VehicleType.METRO, active: true }
    ];

    replacedStations = [
      { id: 1, name: 'S1', position: { id: 1, latitude: 45.23, longitude: 86.12, active: true }, type: VehicleType.BUS, active: true },
      { id: 3, name: 'R7', position: { id: 3, latitude: 73.96, longitude: 55.67, active: true }, type: VehicleType.TRAM, active: true },
      { id: 4, name: 'S4', position: { id: 4, latitude: 82.37, longitude: 43.58, active: true }, type: VehicleType.BUS, active: true },
    ];

    dbTransportLines = [
      {
        id: 1, name: 'R1', positions: {
          id: 1,
          content: '45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 (red,w7|R1)',
          active: true
        }
        , schedule: [1, 2, 3], active: true, type: VehicleType.BUS, zone: 1
      },
      {
        id: 2, name: 'G7', positions: {
          id: 2,
          content: '45.25374, 19.78947 45.24939, 19.79187 45.24552, 19.79419 45.24208, 19.79642(green, w7 | G7)',
          active: true
        },
        schedule: [4, 5, 6], active: true, type: VehicleType.METRO, zone: 2
      },
      {
        id: 3, name: 'V5', positions: {
          id: 3,
          content: '45.25314, 19.80432 45.24728, 19.80766 45.24836, 19.81504 45.24927, 19.82054(brown, w7 | V5)',
          active: true
        },
        schedule: [], active: true, type: VehicleType.TRAM, zone: 1
      },
      {
        id: 4, name: 'M3', positions: {
          id: 4,
          content: '45.26398, 19.83019 45.26543, 19.84401 45.25417, 19.84208 45.24891, 19.81668(purple, w10 | M3)',
          active: true
        },
        schedule: [7, 8, 9], active: true, type: VehicleType.BUS, zone: 3
      }
    ];

    replacedTransportLines = [
      {
        id: 1, name: 'R1', positions: {
          id: 1,
          content: '45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 (red,w7|R1)',
          active: true
        }
        , schedule: [1, 2, 3], active: true, type: VehicleType.BUS, zone: 1
      },
      {
        id: 3, name: 'V5', positions: {
          id: 3,
          content: '45.25314, 19.80432 45.24728, 19.80766 45.24836, 19.81504 45.24927, 19.82054(brown, w7 | V5)',
          active: true
        },
        schedule: [], active: true, type: VehicleType.TRAM, zone: 1
      },
      {
        id: 4, name: 'M3', positions: {
          id: 4,
          content: '45.26398, 19.83019 45.26543, 19.84401 45.25417, 19.84208 45.24891, 19.81668(purple, w10 | M3)',
          active: true
        },
        schedule: [7, 8, 9], active: true, type: VehicleType.BUS, zone: 3
      }
    ];

    newTransportLine = {
      id: 1, name: 'T2', positions: {
        id: 4,
        content: '45.26398, 19.83019 45.26543, 19.84208 45.24891, 19.81668(purple, w7 | T2)',
        active: true
      },
      schedule: [7, 8, 9], active: true, type: VehicleType.BUS, zone: 3
    };

    mockUserService = jasmine.createSpyObj({ 'isOperater': true });
    mockStationService = {
      findAll() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          return of(dbStations, asyncScheduler);
        }
      },
      replaceStations() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          if (empty) {
            return of([], asyncScheduler);
          } else {
            return of(replacedStations, asyncScheduler);
          }
        }
      }
    };
    mockTransportLineService = {
      findAll() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          return of(dbTransportLines, asyncScheduler);
        }
      },
      replaceTransportLines() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          if (empty) {
            return of([], asyncScheduler);
          } else {
            return of(replacedTransportLines, asyncScheduler);
          }
        }
      },
      create() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          return of(newTransportLine, asyncScheduler);
        }
      }
    };
    mockToastrService = jasmine.createSpyObj(['success', 'error']);
    mockTrackerService = jasmine.createSpyObj(['connect', 'disconnect']);
    mockMapService = {
      deepCopyStations() { return {}; },
      applyTransportRoutesChanges(code: string , _: TransportLine[],
        __: TransportLine[]) {
          code =  `[map]45.26377, 19.82895 45.26407, 19.82122 45.26274, 19.81878(red, w7 | R1);
          45.25374, 19.78947 45.24939, 19.79187 45.24552, 19.79419 45.24208, 19.79642(green, w7 | G7);
          45.25314, 19.80432 45.24728, 19.80766 45.24836, 19.81504 45.24927, 19.82054(brown | V5);
          45.26398, 19.83019 45.26543, 19.84401 45.25417, 19.84208 45.24891, 19.81668(purple, w10 | M3)[/map]`;
         },
      placeStations() { }
    };

    spyOn(mockStationService, 'findAll').and.callThrough();
    spyOn(mockStationService, 'replaceStations').and.callThrough();
    spyOn(mockTransportLineService, 'findAll').and.callThrough();
    spyOn(mockTransportLineService, 'replaceTransportLines').and.callThrough();
    spyOn(mockTransportLineService, 'create').and.callThrough();
    spyOn(mockMapService, 'deepCopyStations').and.callThrough();
    spyOn(mockMapService, 'applyTransportRoutesChanges').and.callThrough();
    spyOn(mockMapService, 'placeStations').and.callThrough();


    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule.forRoot(),
      ],
      declarations: [
        MapComponent,
        FakeNavBarComponent
      ],
      providers: [
        NgbModal,
        { provide: UserService, useValue: mockUserService },
        { provide: StationService, useValue: mockStationService },
        { provide: TransportLineService, useValue: mockTransportLineService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: MapService, useValue: mockMapService },
        { provide: TrackerService, useValue: mockTrackerService }
      ]

    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    expect(component).toBeTruthy();
    expect(mockStationService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
    expect(mockTrackerService.connect).toHaveBeenCalled();
  }));

  it('should show all available transport lines', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    const dButtons = fixture.debugElement.queryAll(By.css('button.view'));
    expect(dButtons.length).toBe(dbTransportLines.length);

    expect(dButtons[0].nativeElement.textContent).toContain(dbTransportLines[0].name);
    expect(dButtons[1].nativeElement.textContent).toContain(dbTransportLines[1].name);
    expect(dButtons[2].nativeElement.textContent).toContain(dbTransportLines[2].name);
    expect(dButtons[3].nativeElement.textContent).toContain(dbTransportLines[3].name);

    expect(mockStationService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
    expect(mockTrackerService.connect).toHaveBeenCalled();
  }));

  it('should not show all transport lines because of server error', fakeAsync(() => {
    serverError = true;
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    const dButtons = fixture.debugElement.queryAll(By.css('button.view'));
    expect(dButtons.length).toBe(0);

    expect(mockStationService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
    expect(mockTrackerService.connect).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should update map', fakeAsync(() => {
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
    const countBefore: number = fixture.debugElement.queryAll(By.css('button.view')).length;
    expect(countBefore).toBe(dbTransportLines.length);

    component.edit();
    const applyButton = fixture.debugElement.nativeElement
      .querySelector('#edit > div > div.leaflet-control-container > div.leaflet-top.leaflet-left > div:nth-child(4) > a');
    applyButton.click();

    tick(5000);
    fixture.detectChanges();

    const dButtons = fixture.debugElement.queryAll(By.css('button.view'));
    expect(dButtons.length).toBe(replacedTransportLines.length);

    expect(mockMapService.deepCopyStations).toHaveBeenCalled();
    expect(mockMapService.applyTransportRoutesChanges).toHaveBeenCalled();
    expect(mockMapService.placeStations).toHaveBeenCalled();
    expect(mockTransportLineService.replaceTransportLines).toHaveBeenCalled();
    expect(mockStationService.replaceStations).toHaveBeenCalled();
  }));

  it('should update map to does not contains any transport line and station', fakeAsync(() => {
    empty = true;
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
    const countBefore: number = fixture.debugElement.queryAll(By.css('button.view')).length;
    expect(countBefore).toBe(dbTransportLines.length);

    component.edit();
    const applyButton = fixture.debugElement.nativeElement
      .querySelector('#edit > div > div.leaflet-control-container > div.leaflet-top.leaflet-left > div:nth-child(4) > a');
    applyButton.click();

    tick(5000);
    fixture.detectChanges();

    const dButtons = fixture.debugElement.queryAll(By.css('button.view'));
    expect(dButtons.length).toBe(0);

    expect(mockMapService.deepCopyStations).toHaveBeenCalled();
    expect(mockMapService.applyTransportRoutesChanges).toHaveBeenCalled();
    expect(mockMapService.placeStations).toHaveBeenCalled();
    expect(mockTransportLineService.replaceTransportLines).toHaveBeenCalled();
    expect(mockStationService.replaceStations).toHaveBeenCalled();
  }));

  it('should not update map', fakeAsync(() => {
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
    const countBefore: number = fixture.debugElement.queryAll(By.css('button.view')).length;
    expect(countBefore).toBe(dbTransportLines.length);

    component.edit();
    const cancleButton = fixture.debugElement.nativeElement
      .querySelector('#edit > div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div:nth-child(2) > a');
    cancleButton.click();

    tick(5000);
    fixture.detectChanges();

    const dButtons = fixture.debugElement.queryAll(By.css('button.view'));
    expect(dButtons.length).toBe(dbTransportLines.length);
  }));

  it('should not update map because of server error', fakeAsync(() => {
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
    const countBefore: number = fixture.debugElement.queryAll(By.css('button.view')).length;
    expect(countBefore).toBe(dbTransportLines.length);

    serverError = true;

    component.edit();
    const applyButton = fixture.debugElement.nativeElement
      .querySelector('#edit > div > div.leaflet-control-container > div.leaflet-top.leaflet-left > div:nth-child(4) > a');
    applyButton.click();

    tick(5000);
    fixture.detectChanges();

    const dButtons = fixture.debugElement.queryAll(By.css('button.view'));
    expect(dButtons.length).toBe(dbTransportLines.length);

    expect(mockMapService.deepCopyStations).toHaveBeenCalled();
    expect(mockMapService.applyTransportRoutesChanges).toHaveBeenCalled();
    expect(mockMapService.placeStations).toHaveBeenCalled();
    expect(mockTransportLineService.replaceTransportLines).toHaveBeenCalled();
    expect(mockStationService.replaceStations).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should hide transport line and then show transport line', fakeAsync(() => {
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
    const dButtons = fixture.debugElement.queryAll(By.css('button.view'));
    expect(dButtons.length).toBe(dbTransportLines.length);

    dButtons[1].triggerEventHandler('click', null);
    dButtons[0].triggerEventHandler('click', null);
    dButtons[2].triggerEventHandler('click', null);
    dButtons[3].triggerEventHandler('click', null);
    dButtons[0].triggerEventHandler('click', null);

    tick(5000);
    fixture.detectChanges();
  }));

  it('should update transport line name', fakeAsync(() => {
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
    const countBefore = fixture.debugElement.queryAll(By.css('button.view')).length;
    expect(countBefore).toBe(dbTransportLines.length);

    component.editRoute(dbTransportLines[0].id, component.modalFormElement);

    component.formGroup.get('name').setValue(newTransportLine.name);
    component.formGroup.get('type').setValue(newTransportLine.type);
    component.onFormSubmit();

    tick(5000);
    fixture.detectChanges();

    const dButtons = fixture.debugElement.queryAll(By.css('button.view'));
    expect(dButtons.length).toBe(countBefore);
    expect(dButtons[0].nativeElement.textContent).toContain(newTransportLine.name);

    expect(mockTransportLineService.create).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should not update transport line name because of invalid name', fakeAsync(() => {
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
    const countBefore = fixture.debugElement.queryAll(By.css('button.view')).length;
    expect(countBefore).toBe(dbTransportLines.length);

    component.editRoute(dbTransportLines[0].id, component.modalFormElement);

    component.formGroup.get('name').setValue(null);
    component.formGroup.get('type').setValue(newTransportLine.type);
    component.onFormSubmit();

    tick(5000);
    fixture.detectChanges();

    const dButtons = fixture.debugElement.queryAll(By.css('button.view'));
    expect(dButtons.length).toBe(countBefore);
    expect(dButtons[0].nativeElement.textContent).toContain(dbTransportLines[0].name);

    expect(mockTransportLineService.create).toHaveBeenCalledTimes(0);
    expect(mockToastrService.success).toHaveBeenCalledTimes(0);
  }));

  it('should not update transport line name because of name is not unique', fakeAsync(() => {
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
    const countBefore = fixture.debugElement.queryAll(By.css('button.view')).length;
    expect(countBefore).toBe(dbTransportLines.length);

    component.editRoute(dbTransportLines[0].id, component.modalFormElement);

    component.formGroup.get('name').setValue(dbTransportLines[2].name);
    component.formGroup.get('type').setValue(newTransportLine.type);
    serverError = true;
    component.onFormSubmit();

    tick(5000);
    fixture.detectChanges();

    expect(mockTransportLineService.create).toHaveBeenCalledTimes(1);
    expect(mockToastrService.error).toHaveBeenCalledTimes(1);
  }));

});
