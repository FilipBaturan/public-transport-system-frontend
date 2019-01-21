import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollingModule, ScrollDispatchModule } from '@angular/cdk/scrolling';
import { By } from '@angular/platform-browser';

import { ZoneComponent } from './zone.component';
import { ZoneService } from 'src/app/core/services/zone.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Zone } from 'src/app/model/zone.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
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

describe('ZoneComponent', () => {
  let component: ZoneComponent;
  let fixture: ComponentFixture<ZoneComponent>;

  // mocks
  let mockZoneService: any;
  let mockToastrService: any;

  // data
  let dbZones: Zone[];
  let newZone: Zone;

  // branches condition
  let create: boolean;
  let index: number;
  let minimum: boolean;
  let maximum: boolean;
  let serverError: boolean;
  let unauthorized: boolean;

  beforeEach(async(() => {
    create = true;
    minimum = false;
    maximum = false;
    serverError = false;
    unauthorized = false;
    index = 1;

    dbZones = [
      {
        id: 1, name: 'Z1', lines: [
          { id: 1, name: 'T1', type: VehicleType.BUS, active: true },
          { id: 4, name: 'T4', type: VehicleType.BUS, active: true }
        ], active: true
      },
      { id: 2, name: 'Z2', lines: [], active: true },
      {
        id: 3, name: 'Z3', lines: [
          { id: 3, name: 'T3', type: VehicleType.METRO, active: true },
          { id: 5, name: 'T5', type: VehicleType.BUS, active: true },
          { id: 6, name: 'T6', type: VehicleType.TRAM, active: true }
        ], active: true
      },
      {
        id: 4, name: 'Z4', lines: [
          { id: 2, name: 'T2', type: VehicleType.TRAM, active: true }
        ], active: true
      }
    ];

    newZone = {
      id: 5, name: 'Z5', lines: [
        { id: 7, name: 'T7', type: VehicleType.METRO, active: true }]
      , active: true
    };

    mockZoneService = {
      create() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        }
        if (create) {
          if (maximum) {
            newZone.name = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
          } else if (minimum) {
            newZone.name = 'a';
          }
          dbZones.push(newZone);
        } else {
          if (index === 1) {
            dbZones[index].lines.push(dbZones[0].lines.shift());
          } else {
            dbZones[0].lines.push(dbZones[index].lines.shift());
          }
          dbZones[index].name = newZone.name;
        }
        return of('', asyncScheduler);
      },
      findAll() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else {
          return of(dbZones, asyncScheduler);
        }
      },
      remove() {
        if (serverError) {
          return throwError({ status: 503 }, asyncScheduler);
        } else if (unauthorized) {
          return throwError({ status: 401 }, asyncScheduler);
        } else {
          dbZones.splice(index, 1);
          return of(dbZones, asyncScheduler);
        }
      }
    };

    spyOn(mockZoneService, 'create').and.callThrough();
    spyOn(mockZoneService, 'findAll').and.callThrough();
    spyOn(mockZoneService, 'remove').and.callThrough();

    mockToastrService = jasmine.createSpyObj(['success', 'error']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        ScrollingModule,
        ScrollDispatchModule,
        NgbModule.forRoot()
      ],
      declarations: [
        ZoneComponent,
        FakeNavBarComponent
      ],
      providers: [
        NgbModal,
        { provide: ZoneService, useValue: mockZoneService },
        { provide: ToastrService, useValue: mockToastrService },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(mockZoneService.findAll).toHaveBeenCalled();
  }));

  it('should show no data while data are fetching from server', fakeAsync(() => {
    fixture.detectChanges();
    const dH2 = fixture.debugElement.query(By.css('h2'));
    expect(dH2.nativeElement.textContent).toContain('There are no data about zones');
    tick();
    expect(mockZoneService.findAll).toHaveBeenCalled();
  }));

  it('should show all available zones', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(5); // 4 zone cards and one for add zone card

    expect(dH4[0].nativeElement.textContent).toContain(dbZones[0].name);
    expect(dH4[1].nativeElement.textContent).toContain(dbZones[1].name);
    expect(dH4[2].nativeElement.textContent).toContain(dbZones[2].name);
    expect(dH4[3].nativeElement.textContent).toContain(dbZones[3].name);
    expect(dH4[4].nativeElement.textContent).toContain('Add a Zone');

    const dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(4);

    expect(mockZoneService.findAll).toHaveBeenCalled();
  }));

  it('should create new zone', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.create(component.modalFormElement);

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(newZone.name);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4 + 1);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain(newZone.name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP + 1);
    expect(dP[dP.length - 1].nativeElement.textContent).toContain(newZone.lines.length);

    expect(mockZoneService.create).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should update zone name and add line to zone', fakeAsync(() => {
    create = false;
    index = 1;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.editZone(dbZones[index].id, component.modalFormElement);

    component.formGroup.get('name').setValue(newZone.name);
    component.addLine(dbZones[0].lines[0].id, component.modalFormElement);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[index].nativeElement.textContent).toContain(newZone.name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[index].nativeElement.textContent).toContain(1);

    expect(mockZoneService.create).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should update zone name and remove line from zone', fakeAsync(() => {
    create = false;
    index = 3;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.editZone(dbZones[index].id, component.modalFormElement);

    component.formGroup.get('name').setValue(newZone.name);
    component.removeLine(dbZones[index].lines[0].id, component.modalFormElement);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[index].nativeElement.textContent).toContain(newZone.name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[index].nativeElement.textContent).toContain(0);

    expect(mockZoneService.create).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should ignore lines that are added to multiple zones', fakeAsync(() => {
    create = false;
    index = 3;
    dbZones[0].lines.push(dbZones[index].lines[0]);
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.editZone(dbZones[index].id, component.modalFormElement);

    component.formGroup.get('name').setValue(newZone.name);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[index].nativeElement.textContent).toContain(newZone.name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[index].nativeElement.textContent).toContain(0);

    expect(mockZoneService.create).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should not create zone because of invalid zone name', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.create(component.modalFormElement);

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(null);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain(dbZones[dbZones.length - 1].name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[dP.length - 1].nativeElement.textContent).toContain(dbZones[dbZones.length - 1].lines.length);

    expect(mockZoneService.create).toHaveBeenCalledTimes(0);
    expect(mockToastrService.success).toHaveBeenCalledTimes(0);
  }));

  it('should not create zone because of short zone name', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.create(component.modalFormElement);

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue('');
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain(dbZones[dbZones.length - 1].name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[dP.length - 1].nativeElement.textContent).toContain(dbZones[dbZones.length - 1].lines.length);

    expect(mockZoneService.create).toHaveBeenCalledTimes(0);
    expect(mockToastrService.success).toHaveBeenCalledTimes(0);
  }));

  it('should not create zone because of long zone name', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.create(component.modalFormElement);

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain(dbZones[dbZones.length - 1].name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[dP.length - 1].nativeElement.textContent).toContain(dbZones[dbZones.length - 1].lines.length);

    expect(mockZoneService.create).toHaveBeenCalledTimes(0);
    expect(mockToastrService.success).toHaveBeenCalledTimes(0);
  }));

  it('should create zone with minimum name length', fakeAsync(() => {
    minimum = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.create(component.modalFormElement);

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue('a');
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4 + 1);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain('a');

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP + 1);
    expect(dP[dP.length - 1].nativeElement.textContent).toContain(newZone.lines.length);

    expect(mockZoneService.create).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should create zone with maximum name length', fakeAsync(() => {
    maximum = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.create(component.modalFormElement);

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4 + 1);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP + 1);
    expect(dP[dP.length - 1].nativeElement.textContent).toContain(newZone.lines.length);

    expect(mockZoneService.create).toHaveBeenCalled();
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should remove zone', fakeAsync(() => {
    index = 1;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    component.deleteZone(dbZones[index].id);

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4 - 1);
    expect(dH4[index].nativeElement.textContent).toContain(dbZones[index].name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP - 1);
    expect(dP[index].nativeElement.textContent).toContain(dbZones[index].lines.length);

    expect(mockZoneService.remove).toHaveBeenCalled();
  }));

  it('should not remove zone if user does not has authority', fakeAsync(() => {
    index = 1;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    unauthorized = true;
    component.deleteZone(dbZones[index].id);

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[index].nativeElement.textContent).toContain(dbZones[index].name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[index].nativeElement.textContent).toContain(dbZones[index].lines.length);

    expect(mockZoneService.remove).toHaveBeenCalled();
  }));

  it('should not remove zone if server is down', fakeAsync(() => {
    index = 1;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    serverError = true;
    component.deleteZone(dbZones[index].id);

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[index].nativeElement.textContent).toContain(dbZones[index].name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[index].nativeElement.textContent).toContain(dbZones[index].lines.length);

    expect(mockZoneService.remove).toHaveBeenCalled();
  }));

  it('should not create new zone while server is down', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    let dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    const beforeCountH4 = dH4.length; // 5 zone cards and one for add zone card
    let dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    const beforeCountP = dP.length;

    serverError = true;
    component.create(component.modalFormElement);

    component.formGroup.get('id').setValue(null);
    component.formGroup.get('name').setValue(newZone.name);
    component.onFormSubmit();

    tick();
    fixture.detectChanges();

    dH4 = fixture.debugElement.queryAll(By.css('h4.card-title.text-center'));
    expect(dH4.length).toBe(beforeCountH4);
    expect(dH4[dH4.length - 2].nativeElement.textContent).toContain(dbZones[dbZones.length - 1].name);

    dP = fixture.debugElement.queryAll(By.css('div.card-body p.text-center'));
    expect(dP.length).toBe(beforeCountP);
    expect(dP[dP.length - 1].nativeElement.textContent).toContain(dbZones[dbZones.length - 1].lines.length);

    expect(mockZoneService.create).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should not fetch zones while user server is down', fakeAsync(() => {
    serverError = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const dH2 = fixture.debugElement.query(By.css('h2'));
    expect(dH2.nativeElement.textContent).toContain('There are no data about zones');
    expect(mockZoneService.findAll).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

});
