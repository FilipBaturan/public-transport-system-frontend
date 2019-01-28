import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  MatCheckboxModule, MatCardModule, MatDatepickerModule, MatNativeDateModule,
  MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule,
  MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { PricelistComponent } from './pricelist.component';
import { PricelistService } from 'src/app/core/services/pricelist.service';
import { ZoneService } from 'src/app/core/services/zone.service';
import { ToastrService } from 'ngx-toastr';
import { of, asyncScheduler } from 'rxjs';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { Zone } from 'src/app/model/zone.model';


describe('PricelistComponent', () => {
  let component: PricelistComponent;
  let fixture: ComponentFixture<PricelistComponent>;

  let mockZoneService: any;
  let mockPricelistService: any;
  let mockToastrService: any;

  let dbZones: Zone[];

  beforeEach(async(() => {

    dbZones = [
      {
        id: 1, name: 'DownTown', lines: [
          { id: 1, name: 'D1', type: VehicleType.BUS, active: true },
          { id: 2, name: 'D2', type: VehicleType.METRO, active: true },
          { id: 3, name: 'D3', type: VehicleType.BUS, active: true }
        ], active: true
      },
      {
        id: 2, name: 'Metro Station', lines: [
          { id: 4, name: 'M1', type: VehicleType.BUS, active: true },
          { id: 5, name: 'M2', type: VehicleType.METRO, active: true },
          { id: 6, name: 'M3', type: VehicleType.METRO, active: true }
        ], active: true
      },
      {
        id: 3, name: 'Train Station', lines: [
          { id: 7, name: 'T1', type: VehicleType.TRAM, active: true },
          { id: 8, name: 'T2', type: VehicleType.TRAM, active: true },
          { id: 9, name: 'T3', type: VehicleType.METRO, active: true }
        ], active: true
      }
    ];

    mockZoneService = {
      findAll() { return of(dbZones, asyncScheduler); }
    };

    mockToastrService = jasmine.createSpyObj(['success', 'warning']);

    mockPricelistService = {
      getActivePricelist() { return of([], asyncScheduler); }
    };

    spyOn(mockPricelistService, 'getActivePricelist').and.callThrough();

    TestBed.configureTestingModule({
      imports: [
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
        BrowserAnimationsModule,
        FormsModule
      ],
      declarations: [PricelistComponent],
      providers: [
        { provide: PricelistService, useValue: mockPricelistService },
        { provide: ZoneService, useValue: mockZoneService },
        { provide: ToastrService, useValue: mockToastrService }
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricelistComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('should check start and end date', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    component.endDate = null;
    component.startDate = null;
    component.check();
    expect(mockToastrService.warning).toHaveBeenCalled();

    component.endDate = new Date();
    component.startDate = new Date();
    component.startDate.setDate((new Date()).getDate() - 2);
    component.check();
    expect(mockToastrService.warning).toHaveBeenCalled();

    component.endDate = new Date();
    component.startDate = new Date();
    component.startDate.setDate((new Date()).getDate() + 5);
    component.check();
    expect(mockToastrService.warning).toHaveBeenCalled();

    component.endDate = new Date();
    component.startDate = new Date();
    component.endDate.setDate((new Date()).getDate() + 1);
    component.check();
    expect(mockToastrService.warning).toHaveBeenCalled();
  }));

  it('should create pricelist', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    component.create();

  }));

});
