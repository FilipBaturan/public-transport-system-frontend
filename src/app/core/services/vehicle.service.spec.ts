import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { VehicleService } from './vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { Vehicle, TransportLineIdentifier, VehicleSaver } from 'src/app/model/vehicle.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';


describe('VehicleService', () => {

  const url: string = '/api/vehicle';
  let dbVehicles: Vehicle[]; 
  const vehicleSaver: VehicleSaver = new VehicleSaver(6, 'bus6', VehicleType.BUS, 1);

  let mockToastrService: any;
  let mockHttp: HttpTestingController;
  let service: VehicleService;

  beforeEach(() => {
    dbVehicles = [
      new Vehicle(1, 'bus1', VehicleType.BUS, new TransportLineIdentifier(1, 'B1')),
      new Vehicle(2, 'tram2', VehicleType.TRAM, new TransportLineIdentifier(2, 'T1')),
      new Vehicle(3, 'bus3', VehicleType.BUS, new TransportLineIdentifier(3, 'B2')),
      new Vehicle(4, 'metro4', VehicleType.METRO, new TransportLineIdentifier(4, 'M1')),
      new Vehicle(5, 'bus5', VehicleType.BUS, new TransportLineIdentifier(5, 'B1'))
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
    service.create(vehicleSaver).subscribe(vehicle =>{
      expect(vehicle.id).toEqual(vehicleSaver.id);
      expect(vehicle.name).toEqual(vehicleSaver.name);
      expect(vehicle.type).toEqual(vehicleSaver.type);
      expect(vehicle.currentLine.id).toEqual(vehicleSaver.currentLine);
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(new Vehicle(vehicleSaver.id, vehicleSaver.name,
       vehicleSaver.type, new TransportLineIdentifier(vehicleSaver.currentLine, 'B1')));
  }));

  it('should delete vehicle', fakeAsync(() => {
    let length = dbVehicles.length;
    let v = dbVehicles[1];

    service.remove(1,0,dbVehicles);

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush('Vehicle successfully removed!');

    expect(dbVehicles.length).toBe(length - 1);
    expect(dbVehicles[0]).toEqual(v);
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should receive forbidden error for unauthorized deletion', fakeAsync(() => {
    let length = dbVehicles.length;
    let v = dbVehicles[0];

    service.remove(1,0,dbVehicles);

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Forbidden!'},
      { status: 403, statusText: 'Unauthorazied' });

    expect(dbVehicles.length).toBe(length);
    expect(dbVehicles[0]).toEqual(v);
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should receive vehicle does not exist error', fakeAsync(() => {
    let length = dbVehicles.length;
    let v = dbVehicles[0];

    service.remove(1,0,dbVehicles);

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Vehicle does not exist!'},
      { status: 400, statusText: 'Bad Request' });

    expect(dbVehicles.length).toBe(length);
    expect(dbVehicles[0]).toEqual(v);
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

});
