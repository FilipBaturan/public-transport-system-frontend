import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MapComponent } from './map.component';
import { UserService } from 'src/app/core/services/user.service';
import { StationService } from 'src/app/core/services/station.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from 'src/app/core/services/map.service';
import { Station } from 'src/app/model/station.model';
import { throwError, asyncScheduler, of, observable } from 'rxjs';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { By } from '@angular/platform-browser';

declare var MapBBCode: any;
declare var L: any;

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

  let serverError: boolean;

  let dbStations: Station[];
  let cloneStations: any;
  let dbTransportLines: TransportLine[];

  beforeEach(async(() => {
    serverError = false;

    dbStations = [
      { id: 1, name: 'S1', position: { id: 1, latitude: 45.23, longitude: 86.12, active: true }, type: VehicleType.BUS, active: true },
      { id: 2, name: 'S2', position: { id: 2, latitude: 14.72, longitude: 27.46, active: true }, type: VehicleType.METRO, active: true },
      { id: 3, name: 'S3', position: { id: 3, latitude: 73.96, longitude: 55.67, active: true }, type: VehicleType.TRAM, active: true },
      { id: 4, name: 'S4', position: { id: 4, latitude: 82.37, longitude: 43.58, active: true }, type: VehicleType.BUS, active: true },
      { id: 5, name: 'S5', position: { id: 5, latitude: 93.16, longitude: 71.35, active: true }, type: VehicleType.METRO, active: true },
    ];

    cloneStations = [
      { 1: L.marker([45.23, 86.12], { clickable: true, draggable: true, title: 'BUS-1' }).bindPopup('')},
      { 2: L.marker([14.72, 27.46], { clickable: true, draggable: true, title: 'BUS-1' }).bindPopup('')},
      { 3: L.marker([73.96, 55.67], { clickable: true, draggable: true, title: 'BUS-1' }).bindPopup('')},
      { 4: L.marker([82.37, 43.58], { clickable: true, draggable: true, title: 'BUS-1' }).bindPopup('')},
      { 5: L.marker([93.16, 71.35], { clickable: true, draggable: true, title: 'BUS-1' }).bindPopup('')}
    ];

    dbTransportLines = [
      {
        id: 1, name: 'T1', positions: { id: 1, content: '420 153', active: true }
        , schedule: [1, 2, 3], active: true, type: VehicleType.BUS, zone: 1
      },
      {
        id: 2, name: 'T2', positions: { id: 2, content: '85 12', active: true },
        schedule: [4, 5, 6], active: true, type: VehicleType.METRO, zone: 2
      },
      {
        id: 3, name: 'T3', positions: { id: 3, content: '16 75', active: true },
        schedule: [], active: true, type: VehicleType.TRAM, zone: 1
      },
      {
        id: 4, name: 'T4', positions: { id: 4, content: '34 96', active: true },
        schedule: [7, 8, 9], active: true, type: VehicleType.BUS, zone: 3
      },
      {
        id: 5, name: 'T5', positions: { id: 5, content: '27 34', active: true },
        schedule: [], active: true, type: VehicleType.METRO, zone: 1
      }
    ];

    mockUserService = jasmine.createSpyObj({'isOperater': true});
    mockStationService = {
      findAll() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          return of(dbStations, asyncScheduler);
        }
      },
      replaceStations() {
        return of([], asyncScheduler);
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
        return of([], asyncScheduler);
      }
    };
    mockToastrService = jasmine.createSpyObj(['']);
    mockMapService = {
      connect() {},
      disconnect() {},
      deepCopyStations() {return {}; },
      applyTransportRoutesChanges() {},
      placeStations() {}
    };

    spyOn(mockStationService, 'findAll').and.callThrough();
    spyOn(mockStationService, 'replaceStations').and.callThrough();
    spyOn(mockTransportLineService, 'findAll').and.callThrough();
    spyOn(mockTransportLineService, 'replaceTransportLines').and.callThrough();
    spyOn(mockMapService, 'connect').and.callThrough();

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        MapComponent,
        FakeNavBarComponent
      ],
      providers: [
        NgbModal,
        {provide: UserService, useValue: mockUserService},
        {provide: StationService, useValue: mockStationService},
        {provide: TransportLineService, useValue: mockTransportLineService},
        {provide: ToastrService, useValue: mockToastrService},
        {provide: MapService, useValue: mockMapService}
      ]

    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    expect(component).toBeTruthy();
    expect(mockStationService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
    expect(mockMapService.connect).toHaveBeenCalled();
  }));

  it('should show all available zones', fakeAsync(() => {
    fixture.detectChanges();
    tick(3000);
    fixture.detectChanges();
    const dButtons = fixture.debugElement.queryAll(By.css('button.view'));
    expect(dButtons.length).toBe(dbTransportLines.length);

    expect(dButtons[0].nativeElement.textContent).toContain(dbTransportLines[0].name);
    expect(dButtons[1].nativeElement.textContent).toContain(dbTransportLines[1].name);
    expect(dButtons[2].nativeElement.textContent).toContain(dbTransportLines[2].name);
    expect(dButtons[3].nativeElement.textContent).toContain(dbTransportLines[3].name);
    expect(dButtons[4].nativeElement.textContent).toContain(dbTransportLines[4].name);

    expect(mockStationService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
    expect(mockMapService.connect).toHaveBeenCalled();
  }));

  it('should update map', fakeAsync(() => {
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
     // const dButton = fixture.debugElement.query(By.css('button.edit'));
     // dButton.nativeElement.click();
    // #edit > div > div.leaflet-control-container > div.leaflet-top.leaflet-left > div:nth-child(4) > a
    component.edit();
    const applyButton = fixture.debugElement.nativeElement
    .querySelector('#edit > div > div.leaflet-control-container > div.leaflet-top.leaflet-left > div:nth-child(4) > a');
    console.log(applyButton);
    applyButton.click();
    tick(5000);
    fixture.detectChanges();
    // expect(mockMapService.deepCopyStations).toHaveBeenCalled();
  }));

  it('should not update map', fakeAsync(() => {
    fixture.detectChanges();
    tick(5000);
    fixture.detectChanges();
     // const dButton = fixture.debugElement.query(By.css('button.edit'));
     // dButton.nativeElement.click();
    // #edit > div > div.leaflet-control-container > div.leaflet-top.leaflet-left > div:nth-child(4) > a
    component.edit();
    const applyButton = fixture.debugElement.nativeElement
    .querySelector('#edit > div > div.leaflet-control-container > div.leaflet-top.leaflet-right > div:nth-child(2) > a');
    console.log(applyButton);
    applyButton.click();
    tick(5000);
    fixture.detectChanges();
    // expect(mockMapService.deepCopyStations).toHaveBeenCalled();
  }));

});
