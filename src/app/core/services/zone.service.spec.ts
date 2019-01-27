import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ZoneService } from './zone.service';
import { ToastrService } from 'ngx-toastr';
import { Zone } from 'src/app/model/zone.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';

describe('ZoneService', () => {

  const url = '/api/zone';
  let dbZones: Zone[];
  const zone: Zone = {id: 4, name: 'Beach', lines: [
    {id: 10, name: 'B1', type: VehicleType.BUS, active: true},
    {id: 11, name: 'B2', type: VehicleType.METRO, active: true},
    {id: 12, name: 'B3', type: VehicleType.BUS, active: true}
  ], active: true};

  let mockToastrService: any;
  let mockHttp: HttpTestingController;
  let service: ZoneService;

  beforeEach(() => {
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
    req.flush({ id: zone.id, name: zone.name, lines: zone.lines, active: zone.active });
    expect(req.request.body).toBe(zone);
  }));

  it('should delete zone', fakeAsync(() => {
    service.remove(1).subscribe(result => expect(result).toBe('Zone successfully removed!'));

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush('Zone successfully removed!');
    expect(req.request.responseType).toBe('text');
  }));

  it('should receive forbidden error for unauthorized deletion', fakeAsync(() => {
    service.remove(1).subscribe(() => {}, error => expect(error.status).toBe(401));

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Forbidden!' },
      { status: 401, statusText: 'Unauthorazied' });
    expect(req.request.responseType).toBe('text');
  }));

  it('should receive zone does not exist error', fakeAsync(() => {
    service.remove(1).subscribe(() => {}, error => expect(error.status).toBe(400));

    const req = mockHttp.expectOne(url + '/' + 1);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Zone does not exist!' },
      { status: 400, statusText: 'Bad Request' });
    expect(req.request.responseType).toBe('text');
  }));

});
