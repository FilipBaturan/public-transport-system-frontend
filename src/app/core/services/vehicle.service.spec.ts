import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { VehicleService } from './vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { Vehicle, VehicleSaver } from 'src/app/model/vehicle.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';


describe('VehicleService', () => {

  const url = '/api/vehicle';
  let dbVehicles: Vehicle[];
  const vehicleSaver: VehicleSaver = { id: 6, name: 'bus6', type: VehicleType.BUS, currentLine: 1, active: true };

  let mockToastrService: any;
  let mockHttp: HttpTestingController;
  let service: VehicleService;

  beforeEach(() => {
    dbVehicles = [
      { id: 1, name: 'bus1', type: VehicleType.BUS, currentLine: { id: 1, name: 'B1' } },
      { id: 2, name: 'tram2', type: VehicleType.TRAM, currentLine: { id: 2, name: 'T1' } },
      { id: 3, name: 'bus3', type: VehicleType.BUS, currentLine: { id: 3, name: 'B2' } },
      { id: 4, name: 'metro4', type: VehicleType.METRO, currentLine: { id: 4, name: 'M1' } },
      { id: 5, name: 'bus5', type: VehicleType.BUS, currentLine: { id: 5, name: 'B1' } }
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
    service = TestBed.get(VehicleService);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', fakeAsync(() => {
    expect(service).toBeTruthy();
  }));

  it('should get all available vehicles', fakeAsync(() => {
    service.findAll().subscribe(vehicles => {
      expect(vehicles.length).toBe(dbVehicles.length);
      expect(vehicles[0]).toEqual(dbVehicles[0]);
      expect(vehicles[1]).toEqual(dbVehicles[1]);
      expect(vehicles[2]).toEqual(dbVehicles[2]);
      expect(vehicles[3]).toEqual(dbVehicles[3]);
      expect(vehicles[4]).toEqual(dbVehicles[4]);
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(dbVehicles);
  }));

  it('should receive client side error', fakeAsync(() => {
    service.findAll().subscribe(() => { }, err => {
      expect(err).toBe('Client side error!');
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should receive access denied error', fakeAsync(() => {
    service.findAll().subscribe(() => { }, err => {
      expect(err).toBe('Access denied!');
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush('Access denied!', { status: 401, statusText: 'Unathorized' });
  }));

  it('should receive server is down error', fakeAsync(() => {
    service.findAll().subscribe(() => { }, err => {
      expect(err).toBe('Server is down!');
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush('Error occured ', { status: 504, statusText: 'Gateway Timeout' });
  }));

  it('should receive vehicle and transport line type error', fakeAsync(() => {
    service.findAll().subscribe(() => { }, err => {
      expect(err).toBe('Vehicle and tranport line type do not match!');
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Vehicle and tranport line type do not match!' },
      { status: 400, statusText: 'Bad Request' });
  }));

  it('should create/update vehicle', fakeAsync(() => {
    service.create(vehicleSaver).subscribe(vehicle => {
      expect(vehicle.id).toEqual(vehicleSaver.id);
      expect(vehicle.name).toEqual(vehicleSaver.name);
      expect(vehicle.type).toEqual(vehicleSaver.type);
      expect(vehicle.currentLine.id).toEqual(vehicleSaver.currentLine);
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush({
      id: vehicleSaver.id, name: vehicleSaver.name,
      type: vehicleSaver.type,
      currentLine: { id: vehicleSaver.currentLine, name: 'B1' }
    });
    expect(req.request.body).toBe(vehicleSaver);
  }));

  it('should delete vehicle', fakeAsync(() => {
    const length = dbVehicles.length;
    const v = dbVehicles[1];

    service.remove(1, 0, dbVehicles);

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush('Vehicle successfully removed!');
    expect(req.request.responseType).toBe('text');

    expect(dbVehicles.length).toBe(length - 1);
    expect(dbVehicles[0]).toEqual(v);
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should receive forbidden error for unauthorized deletion', fakeAsync(() => {
    const length = dbVehicles.length;
    const v = dbVehicles[0];

    service.remove(1, 0, dbVehicles);

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Forbidden!' },
      { status: 401, statusText: 'Unauthorazied' });
    expect(req.request.responseType).toBe('text');

    expect(dbVehicles.length).toBe(length);
    expect(dbVehicles[0]).toEqual(v);
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should receive vehicle does not exist error', fakeAsync(() => {
    const length = dbVehicles.length;
    const v = dbVehicles[0];

    service.remove(1, 0, dbVehicles);

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Vehicle does not exist!' },
      { status: 400, statusText: 'Bad Request' });
    expect(req.request.responseType).toBe('text');

    expect(dbVehicles.length).toBe(length);
    expect(dbVehicles[0]).toEqual(v);
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

});
