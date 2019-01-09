import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { VehicleComponent } from './vehicle.component';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Vehicle, TransportLineIdentifier } from 'src/app/model/vehicle.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { of, asyncScheduler, throwError } from 'rxjs';
import { TransportLine } from 'src/app/model/transport-line.model';
import { TransportLinePosition } from 'src/app/model/position.model';


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
  let newVehicle: Vehicle;

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

    newVehicle = new Vehicle(6, 'bus6', 'BUS', new TransportLineIdentifier(7, 'B1'));


    mockVehicleService = jasmine.createSpyObj({
      'findAll': of(dbVehicles, asyncScheduler),
      'create': of(newVehicle, asyncScheduler)
    });
    mockTransportLineService = jasmine.createSpyObj({ 'findAll': of(dbTransportLines, asyncScheduler) });

    mockToastrService = jasmine.createSpyObj(['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule.forRoot()
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
    expect(dH4[5].nativeElement.textContent).toContain('Add a Vehicle');

    const dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(5);

    expect(mockVehicleService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
  }));

  it('should create new vehicle', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    let beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    let beforeCountP = dP.length;

    component.open(component.modalFormElement);
    component.onTypeChange('BUS');

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(newVehicle.name);
    component.formGroup.get('type').setValue(newVehicle.type);
    component.formGroup.get('currentLine').setValue(newVehicle.currentLine);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4 + 1);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain(newVehicle.name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP + 1);
    expect(dP[dP.length - 2].nativeElement.textContent).toContain(newVehicle.currentLine.name);

    expect(mockVehicleService.create).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should not create vehicle because of invalid vehicle name or type', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    let beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    let beforeCountP = dP.length;

    component.open(component.modalFormElement);
    component.onTypeChange('BUS');

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(null);
    component.formGroup.get('type').setValue(null);
    component.formGroup.get('currentLine').setValue(newVehicle.currentLine);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain(dbVehicles[dbVehicles.length - 1].name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[dP.length - 1].nativeElement.textContent)
      .toContain(dbVehicles[dbVehicles.length - 1].currentLine.name);

    expect(mockVehicleService.create).toHaveBeenCalledTimes(0);
    expect(mockToastrService.success).toHaveBeenCalledTimes(0);
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
  let dbVehicles: Vehicle[];
  let dbTransportLines: TransportLine[];
  let newVehicle: Vehicle;

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

    newVehicle = new Vehicle(dbVehicles[0].id, 'bus6', 'BUS', new TransportLineIdentifier(7, 'B1'));

    mockVehicleService = jasmine.createSpyObj({
      'findAll': of(dbVehicles, asyncScheduler),
      'create': of(newVehicle, asyncScheduler)
    });
    mockTransportLineService = jasmine.createSpyObj({ 'findAll': of(dbTransportLines, asyncScheduler) });

    mockToastrService = jasmine.createSpyObj(['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule.forRoot()
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

  it('should update vehicle', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    let beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    let beforeCountP = dP.length;

    expect(mockVehicleService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();

    component.editVehicle(dbVehicles[0].id, component.modalFormElement);

    component.formGroup.get('id').setValue(newVehicle.id);
    component.formGroup.get('name').setValue(newVehicle.name);
    component.formGroup.get('type').setValue(newVehicle.type);
    component.formGroup.get('currentLine').setValue(newVehicle.currentLine);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[0].nativeElement.textContent).toContain(newVehicle.name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[0].nativeElement.textContent).toContain(newVehicle.currentLine.name);

    expect(mockVehicleService.create).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
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
  let dbVehicles: Vehicle[];
  let dbTransportLines: TransportLine[];
  let newVehicle: Vehicle;

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

    newVehicle = new Vehicle(dbVehicles[0].id, 'bus6', 'BUS', null);

    mockVehicleService = {
      findAll() {
        return of(dbVehicles, asyncScheduler);
      },
      create() {
        return of(newVehicle, asyncScheduler);
      },
      remove() {
        dbVehicles.splice(dbVehicles.length - 1);
        return of('', asyncScheduler);
      }
    }

    spyOn(mockVehicleService, 'findAll').and.callThrough();
    spyOn(mockVehicleService, 'create').and.callThrough();
    spyOn(mockVehicleService, 'remove').and.callThrough();

    mockTransportLineService = jasmine.createSpyObj({ 'findAll': of(dbTransportLines, asyncScheduler) });

    mockToastrService = jasmine.createSpyObj(['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule.forRoot()
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

  it('should delete vehicle', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    let beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card

    component.deleteVehicle(dbVehicles[dbVehicles.length - 1].id);

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4 - 1);
    expect(dH4[dH4.length - 1].nativeElement.textContent).toContain('Add a Vehicle');

    expect(mockVehicleService.remove).toHaveBeenCalled();
  }));

  it('should create new vehicle with none current line', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    let beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    let beforeCountP = dP.length;

    component.open(component.modalFormElement);
    component.onTypeChange('BUS');

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(newVehicle.name);
    component.formGroup.get('type').setValue(newVehicle.type);
    component.formGroup.get('currentLine').setValue(newVehicle.currentLine);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4 + 1);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain(newVehicle.name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP + 1);
    expect(dP[dP.length - 1].nativeElement.textContent).toContain('None');

    expect(mockVehicleService.create).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
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
  let dbVehicles: Vehicle[];
  let dbTransportLines: TransportLine[];
  let newVehicle: Vehicle;

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

    newVehicle = new Vehicle(dbVehicles[0].id, 'bus6', 'BUS', null);

    mockVehicleService = jasmine.createSpyObj({
      'findAll': of(dbVehicles, asyncScheduler),
      'create': throwError({ status: 503 }, asyncScheduler)
    });
    mockTransportLineService = jasmine.createSpyObj({ 'findAll': of(dbTransportLines, asyncScheduler) });

    mockToastrService = jasmine.createSpyObj(['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule.forRoot()
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

  it('should not create new vehicle while server is down', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    let beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    let beforeCountP = dP.length;

    component.open(component.modalFormElement);
    component.onTypeChange('BUS');

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(newVehicle.name);
    component.formGroup.get('type').setValue(newVehicle.type);
    component.formGroup.get('currentLine').setValue(newVehicle.currentLine);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain(dbVehicles[dbVehicles.length - 1].name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[dP.length - 1].nativeElement.textContent)
      .toContain(dbVehicles[dbVehicles.length - 1].currentLine.name);

    expect(mockVehicleService.create).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();
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
  let dbVehicles: Vehicle[];
  let dbTransportLines: TransportLine[];
  let newVehicle: Vehicle;

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

    newVehicle = new Vehicle(dbVehicles[0].id, 'bus6', 'BUS', null);

    mockVehicleService = jasmine.createSpyObj({
      'findAll': of(dbVehicles, asyncScheduler),
      'create': throwError({ status: 403 }, asyncScheduler)
    });
    mockTransportLineService = jasmine.createSpyObj({ 'findAll': of(dbTransportLines, asyncScheduler) });

    mockToastrService = jasmine.createSpyObj(['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgbModule.forRoot()
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

  it('should not create new vehicle if user is unauthorized', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    let beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    let beforeCountP = dP.length;

    component.open(component.modalFormElement);
    component.onTypeChange('BUS');

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(newVehicle.name);
    component.formGroup.get('type').setValue(newVehicle.type);
    component.formGroup.get('currentLine').setValue(newVehicle.currentLine);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain(dbVehicles[dbVehicles.length - 1].name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[dP.length - 1].nativeElement.textContent)
      .toContain(dbVehicles[dbVehicles.length - 1].currentLine.name);

    expect(mockVehicleService.create).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

});

describe('VehicleComponent', () => {
  let fixture: ComponentFixture<VehicleComponent>;

  // mocks
  let mockVehicleService: any;
  let mockTransportLineService: any;
  let mockToastrService: any;

  beforeEach(fakeAsync(() => {

    mockVehicleService = jasmine.createSpyObj({
      'findAll': throwError({ status: 503 }, asyncScheduler),
      'create': throwError({ status: 503 }, asyncScheduler)
    });
    mockTransportLineService = jasmine.createSpyObj({ 'findAll': throwError({ status: 503 }, asyncScheduler) });

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
  }));

  it('should show no data while server is down', fakeAsync(() => {
    fixture.detectChanges();
    let dH2 = fixture.debugElement.query(By.css('h2'));
    expect(dH2.nativeElement.textContent).toContain('There are no data about vehicles');
    tick();
    dH2 = fixture.debugElement.query(By.css('h2'));
    expect(dH2.nativeElement.textContent).toContain('There are no data about vehicles');
    expect(mockToastrService.error).toHaveBeenCalled();
    expect(mockVehicleService.findAll).toHaveBeenCalled();
    expect(mockTransportLineService.findAll).toHaveBeenCalled();
  }));

  

});

