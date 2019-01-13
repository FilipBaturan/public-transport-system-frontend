import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { ZoneService } from './zone.service';
import { ToastrService } from 'ngx-toastr';
import { Zone } from 'src/app/model/zone.model';
import { ZoneTransportLine } from 'src/app/model/zone.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';

describe('ZoneService', () => {

  const url: string = '/api/zone';
  let dbZones: Zone[];
  let zone: Zone = new Zone(4, 'Beach', [
    new ZoneTransportLine(10, 'B1', VehicleType.BUS, true),
    new ZoneTransportLine(11, 'B2', VehicleType.METRO, true),
    new ZoneTransportLine(12, 'B3', VehicleType.BUS, true)
  ], true);

  let mockToastrService: any;
  let mockHttp: HttpTestingController;
  let service: ZoneService;

  beforeEach(() => {
    dbZones = [
      new Zone(1, 'DownTown', [
        new ZoneTransportLine(1, 'D1', VehicleType.BUS, true),
        new ZoneTransportLine(2, 'D2', VehicleType.METRO, true),
        new ZoneTransportLine(3, 'D3', VehicleType.BUS, true)
      ], true),
      new Zone(2, 'Metro Station', [
        new ZoneTransportLine(4, 'M1', VehicleType.BUS, true),
        new ZoneTransportLine(5, 'M2', VehicleType.METRO, true),
        new ZoneTransportLine(6, 'M3', VehicleType.METRO, true)
      ], true),
      new Zone(3, 'Train Station', [
        new ZoneTransportLine(7, 'T1', VehicleType.TRAM, true),
        new ZoneTransportLine(8, 'T2', VehicleType.TRAM, true),
        new ZoneTransportLine(9, 'T3', VehicleType.METRO, true)
      ], true)
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
    service = TestBed.get(ZoneService);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    service = TestBed.get(ZoneService);
    expect(service).toBeTruthy();
  });

  it('should get all available zones', fakeAsync(() => {
    service.findAll().subscribe(vehicles => {
      expect(vehicles.length).toBe(dbZones.length);
      expect(vehicles[0]).toEqual(dbZones[0]);
      expect(vehicles[1]).toEqual(dbZones[1]);
      expect(vehicles[2]).toEqual(dbZones[2]);
      expect(vehicles[3]).toEqual(dbZones[3]);
      expect(vehicles[4]).toEqual(dbZones[4]);
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(dbZones);
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

  it('should create/update zone', fakeAsync(() => {
    service.create(zone).subscribe(z => {
      expect(z.id).toEqual(z.id);
      expect(z.name).toEqual(z.name);
      expect(z.lines).toEqual(z.lines);
      expect(z.active).toEqual(z.active);
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(new Zone(zone.id, zone.name, zone.lines, zone.active));
  }));

  it('should delete zone', fakeAsync(() => {

    service.remove(1,dbZones);

    const req1 = mockHttp.expectOne(url + '/' + 1);
    expect(req1.request.method).toBe('DELETE');
    req1.flush('Zone successfully removed!');

    const req2 = mockHttp.expectOne(url);
    expect(req2.request.method).toBe('GET');
    req2.flush(dbZones.splice(0,1));
    expect(mockToastrService.success).toHaveBeenCalled();
  }));

  it('should receive forbidden error for unauthorized deletion', fakeAsync(() => {
    let length = dbZones.length;
    let z = dbZones[0];

    service.remove(1,dbZones);

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Forbidden!'},
      { status: 403, statusText: 'Unauthorazied' });

    expect(dbZones.length).toBe(length);
    expect(dbZones[0]).toEqual(z);
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should receive zone does not exist error', fakeAsync(() => {
    let length = dbZones.length;
    let z = dbZones[0];

    service.remove(1,dbZones);

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Zone does not exist!'},
    { status: 400, statusText: 'Bad Request' });

    expect(dbZones.length).toBe(length);
    expect(dbZones[0]).toEqual(z);
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

});
