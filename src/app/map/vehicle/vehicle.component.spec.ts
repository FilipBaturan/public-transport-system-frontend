import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { VehicleComponent } from './vehicle.component';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Vehicle, TransportLineIdentifier } from 'src/app/model/vehicle.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { of, asyncScheduler, throwError } from 'rxjs';
import { TransportLine } from 'src/app/model/transport-line.model';
import { TransportLinePosition } from 'src/app/model/position.model';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('VehicleComponent', () => {
  let component: VehicleComponent;
  let fixture: ComponentFixture<VehicleComponent>;

  // mocks
  let mockVehicleService: any;
  let mockTransportLineService: any;
  let mockToastrService: any;

  // data
  let dbVehicles: Vehicle[];
  let dbTransportLines: TransportLine[];

  beforeEach(fakeAsync(() => {

    dbVehicles = [
      new Vehicle(1, 'bus1', VehicleType.BUS, new TransportLineIdentifier(1, 'B1')),
      new Vehicle(2, 'tram2', VehicleType.TRAM, new TransportLineIdentifier(2, 'T1')),
      new Vehicle(3, 'bus3', VehicleType.BUS, new TransportLineIdentifier(3, 'B2')),
      new Vehicle(4, 'metro4', VehicleType.METRO, new TransportLineIdentifier(4, 'M1')),
      new Vehicle(5, 'bus5', VehicleType.BUS, new TransportLineIdentifier(5, 'B1'))
    ];

    dbTransportLines = [
      new TransportLine(1, 'T1', new TransportLinePosition(1, '420 153', true), [1, 2, 3], true, 'BUS', 1),
      new TransportLine(2, 'T2', new TransportLinePosition(2, '85 12', true), [4, 5, 6], true, 'METRO', 2),
      new TransportLine(3, 'T3', new TransportLinePosition(3, '16 75', true), [], true, 'TRAM', 1),
      new TransportLine(4, 'T4', new TransportLinePosition(4, '34 96', true), [7, 8, 9], true, 'BUS', 3),
      new TransportLine(5, 'T5', new TransportLinePosition(5, '27 34', true), [], true, 'METRO', 1)
    ];

    mockVehicleService = jasmine.createSpyObj({ 'findAll': of(dbVehicles, asyncScheduler) });
    mockTransportLineService = jasmine.createSpyObj({ 'findAll': of(dbTransportLines, asyncScheduler) });

    mockToastrService = jasmine.createSpyObj(['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        VehicleComponent,
        FakeNavBarComponent
      ],
      providers: [
        NgbModal,
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: TransportLineService, useValue: mockTransportLineService },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    });
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(VehicleComponent);
    component = fixture.componentInstance;
  }));

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(mockVehicleService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
  }));

  it('should show no data while data are fetching from server', fakeAsync(() => {
    fixture.detectChanges();
    const dH2 = fixture.debugElement.query(By.css('h2'));
    expect(dH2.nativeElement.textContent).toContain('There are no data about vehicles');
    tick();
    expect(mockVehicleService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
  }));

  it('should show all available vehicles', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(6); // 5 vehicle cards and one for add vehicle card
    
    expect(dH4[0].nativeElement.textContent).toContain(dbVehicles[0].name);
    expect(dH4[1].nativeElement.textContent).toContain(dbVehicles[1].name);
    expect(dH4[2].nativeElement.textContent).toContain(dbVehicles[2].name);
    expect(dH4[3].nativeElement.textContent).toContain(dbVehicles[3].name);
    expect(dH4[4].nativeElement.textContent).toContain(dbVehicles[4].name);

    const dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(5);

    expect(mockVehicleService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
  }));

});

describe('VehicleComponent', () => {
  let component: VehicleComponent;
  let fixture: ComponentFixture<VehicleComponent>;

  // mocks
  let mockVehicleService: any;
  let mockTransportLineService: any;
  let mockToastrService: any;

  // data
  // let dbVehicles: Vehicle[];
  // let dbTransportLines: TransportLine[];

  beforeEach(fakeAsync(() => {

    mockVehicleService = jasmine.createSpyObj({ 'findAll': throwError({status: 503}, asyncScheduler)});
    mockTransportLineService = jasmine.createSpyObj({ 'findAll': throwError({status: 503}, asyncScheduler)});

    mockToastrService = jasmine.createSpyObj(['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        VehicleComponent,
        FakeNavBarComponent
      ],
      providers: [
        NgbModal,
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: TransportLineService, useValue: mockTransportLineService },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    });
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(VehicleComponent);
    component = fixture.componentInstance;
  }));

  it('should show no data while server is down', fakeAsync(() => {
    fixture.detectChanges();
    let dH2 = fixture.debugElement.query(By.css('h2'));
    expect(dH2.nativeElement.textContent).toContain('There are no data about vehicles');
    tick();
    expect(mockToastrService.error).toHaveBeenCalled();
    dH2 = fixture.debugElement.query(By.css('h2'));
    expect(dH2.nativeElement.textContent).toContain('There are no data about vehicles');
  }));
});
