import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { VehicleComponent } from './vehicle.component';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Vehicle } from 'src/app/model/vehicle.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { of, asyncScheduler, throwError } from 'rxjs';
import { TransportLine } from 'src/app/model/transport-line.model';


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

  // branches condition
  let create: boolean;
  let minimum: boolean;
  let maximum: boolean;
  let noCurrentLine: boolean;
  let serverError: boolean;
  let unauthorized: boolean;

  beforeEach(fakeAsync(() => {
    create = true;
    minimum = false;
    maximum = false;
    noCurrentLine = false;
    serverError = false;
    unauthorized = false;

    dbVehicles = [
      { id: 1, name: 'bus1', type: VehicleType.BUS, currentLine: { id: 1, name: 'B1' } },
      { id: 2, name: 'tram2', type: VehicleType.TRAM, currentLine: { id: 2, name: 'T1' } },
      { id: 3, name: 'bus3', type: VehicleType.BUS, currentLine: { id: 3, name: 'B2' } },
      { id: 4, name: 'metro4', type: VehicleType.METRO, currentLine: { id: 4, name: 'M1' } },
      { id: 5, name: 'bus5', type: VehicleType.BUS, currentLine: { id: 5, name: 'B1' } }
    ];

    dbTransportLines = [
      { id: 1, name: 'T1',
      positions: { id: 1, content: '420 153', active: true },
      schedule: [1, 2, 3], active: true, type: VehicleType.BUS, zone: 1 }
      ,
      {id: 2, name: 'T2',
      positions: {id: 2, content: '85 12', active: true},
      schedule: [4, 5, 6], active: true, type: VehicleType.METRO, zone: 2},
      {id: 3, name: 'T3', positions: {id: 3, content: '16 75', active: true},
       schedule: [], active: true, type: VehicleType.TRAM, zone: 1},
      {id: 4, name: 'T4', positions: {id: 4, content: '34 96', active: true},
      schedule: [7, 8, 9], active: true, type: VehicleType.BUS, zone: 3},
      {id: 5, name: 'T5', positions: {id: 5, content: '27 34', active: true},
       schedule: [], active: true, type: VehicleType.METRO, zone: 1}
    ];

    newVehicle = { id: 6, name: 'bus6', type: VehicleType.BUS, currentLine: { id: 7, name: 'B1' } };

    mockVehicleService = {
      create() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        }
        if (unauthorized) {
          return throwError({ status: 401 }, asyncScheduler);
        }
        if (create) {
          if (maximum) {
            newVehicle.name = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
          } else if (minimum) {
            newVehicle.name = 'a';
          } else if (noCurrentLine) {
            newVehicle.currentLine = null;
          }
          return of(newVehicle, asyncScheduler);
        } else {
          dbVehicles[0].id = newVehicle.id;
          dbVehicles[0].name = newVehicle.name;
          dbVehicles[0].currentLine = newVehicle.currentLine;
          dbVehicles[0].type = newVehicle.type;
          return of(newVehicle, asyncScheduler);
        }
      },
      findAll() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          return of(dbVehicles, asyncScheduler);
        }
      },
      remove() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else if (unauthorized) {
          return throwError({ status: 401 }, asyncScheduler);
        } else {
          return of('', asyncScheduler);
        }
      }
    };

    spyOn(mockVehicleService, 'create').and.callThrough();
    spyOn(mockVehicleService, 'findAll').and.callThrough();
    spyOn(mockVehicleService, 'remove').and.callThrough();

    mockTransportLineService = {
      findAll() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          return of(dbTransportLines, asyncScheduler);
        }
      }
    };

    spyOn(mockTransportLineService, 'findAll').and.callThrough();

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
    const beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

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
    const beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

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

  it('should update vehicle', fakeAsync(() => {
    create = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

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

  it('should create new vehicle with none current line', fakeAsync(() => {
    noCurrentLine = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.open(component.modalFormElement);
    component.onTypeChange('BUS');

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(newVehicle.name);
    component.formGroup.get('type').setValue(newVehicle.type);
    component.formGroup.get('currentLine').setValue(null);
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

  it('should delete vehicle', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card

    component.deleteVehicle(dbVehicles[dbVehicles.length - 1].id);

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4 - 1);
    expect(dH4[dH4.length - 1].nativeElement.textContent).toContain('Add a Vehicle');

    expect(mockVehicleService.remove).toHaveBeenCalled();
  }));

  it('should delete vehicle if user is unauthorized', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card

    unauthorized = true;
    component.deleteVehicle(dbVehicles[dbVehicles.length - 1].id);

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[dH4.length - 1].nativeElement.textContent).toContain('Add a Vehicle');

    expect(mockVehicleService.remove).toHaveBeenCalled();
  }));

  it('should delete vehicle if server is down', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card

    serverError = true;
    component.deleteVehicle(dbVehicles[dbVehicles.length - 1].id);

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[dH4.length - 1].nativeElement.textContent).toContain('Add a Vehicle');

    expect(mockVehicleService.remove).toHaveBeenCalled();
  }));

  it('should not create new vehicle while server is down', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.open(component.modalFormElement);
    component.onTypeChange('BUS');

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(newVehicle.name);
    component.formGroup.get('type').setValue(newVehicle.type);
    component.formGroup.get('currentLine').setValue(newVehicle.currentLine);
    serverError = true;
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

  it('should not create new vehicle if user is unauthorized', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 vehicle cards and one for add vehicle card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.open(component.modalFormElement);
    component.onTypeChange('BUS');

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(newVehicle.name);
    component.formGroup.get('type').setValue(newVehicle.type);
    component.formGroup.get('currentLine').setValue(newVehicle.currentLine);
    unauthorized = true;
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

  it('should show no data while server is down', fakeAsync(() => {
    serverError = true;
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
