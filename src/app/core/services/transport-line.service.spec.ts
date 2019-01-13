import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TransportLineService } from './transport-line.service';
import { TransportLine, TransportLineCollection } from 'src/app/model/transport-line.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';

describe('TransportLineService', () => {

  const url = '/api/transportLine';
  let dbTransportLines: TransportLine[];
  const newTransportLine: TransportLine = {
    id: 7, name: 'T7',
    positions: { id: 7, content: '73 17', active: true },
    schedule: [], active: true, vehicleType: VehicleType.BUS, zone: 1
  };

  let mockHttp: HttpTestingController;
  let service: TransportLineService;

  beforeEach(() => {
    dbTransportLines = [
      {
        id: 1, name: 'T1', positions: { id: 1, content: '420 153', active: true }
        , schedule: [1, 2, 3], active: true, vehicleType: VehicleType.BUS, zone: 1
      },
      {
        id: 2, name: 'T2', positions: { id: 2, content: '85 12', active: true },
        schedule: [4, 5, 6], active: true, vehicleType: VehicleType.METRO, zone: 2
      },
      {
        id: 3, name: 'T3', positions: { id: 3, content: '16 75', active: true },
        schedule: [], active: true, vehicleType: VehicleType.TRAM, zone: 1
      },
      {
        id: 4, name: 'T4', positions: { id: 4, content: '34 96', active: true },
        schedule: [7, 8, 9], active: true, vehicleType: VehicleType.BUS, zone: 3
      },
      {
        id: 5, name: 'T5', positions: { id: 5, content: '27 34', active: true },
        schedule: [], active: true, vehicleType: VehicleType.METRO, zone: 1
      }
    ];

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    mockHttp = TestBed.get(HttpTestingController);
    service = TestBed.get(TransportLineService);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all available transport lines', fakeAsync(() => {
    service.findAll().subscribe(transportLines => {
      expect(transportLines.length).toBe(dbTransportLines.length);
      expect(transportLines[0]).toEqual(dbTransportLines[0]);
      expect(transportLines[1]).toEqual(dbTransportLines[1]);
      expect(transportLines[2]).toEqual(dbTransportLines[2]);
      expect(transportLines[3]).toEqual(dbTransportLines[3]);
      expect(transportLines[4]).toEqual(dbTransportLines[4]);
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(dbTransportLines);
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

  it('should create/update transport line', fakeAsync(() => {
    const tl = {
      id: null, name: 'T7', positions: { id: null, content: '42.34 56.17', active: true },
      schedule: [], active: true, vehicleType: VehicleType.BUS, zone: 1
    };
    service.create(tl).subscribe(transportLine => {
      expect(transportLine.id).toEqual(newTransportLine.id);
      expect(transportLine.name).toEqual(newTransportLine.name);
      expect(transportLine.positions).toEqual(newTransportLine.positions);
      expect(transportLine.schedule).toEqual(newTransportLine.schedule);
      expect(transportLine.active).toEqual(newTransportLine.active);
      expect(transportLine.vehicleType).toEqual(newTransportLine.vehicleType);
      expect(transportLine.zone).toEqual(newTransportLine.zone);
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(newTransportLine);
  }));

  it('should create new transport lines and update changed transport lines', fakeAsync(() => {
    const collection: TransportLineCollection = {
      transportLines: [
        dbTransportLines[0],
        dbTransportLines[2],
        {
          id: dbTransportLines[4].id, name: dbTransportLines[4].name,
          positions: {
            id: dbTransportLines[4].positions.id,
            content: dbTransportLines[4].positions.content,
            active: dbTransportLines[4].positions.active
          },
          schedule: dbTransportLines[4].schedule,
          active: dbTransportLines[4].active, vehicleType: dbTransportLines[4].vehicleType, zone: dbTransportLines[4].zone
        },
        {
          id: null, name: 'T7', positions: { id: null, content: '73.72 42.19', active: true },
          schedule: [], active: true, vehicleType: VehicleType.BUS, zone: 1
        }
      ]
    };

    const updatedCollection: TransportLineCollection = {
      transportLines: [
        collection[0],
        collection[1],
        collection[2],
        {
          id: 7, name: 'T7', positions: { id: 7, content: '73 17', active: true },
          schedule: [], active: true, type: VehicleType.BUS, zone: 1
        }
      ]
    };

    service.replaceTransportLines(collection).subscribe(transportLines => {
      expect(transportLines.length).toBe(updatedCollection.transportLines.length);
      expect(transportLines[0]).toEqual(updatedCollection.transportLines[0]);
      expect(transportLines[1]).toEqual(updatedCollection.transportLines[1]);
      expect(transportLines[2]).toEqual(updatedCollection.transportLines[2]);
      expect(transportLines[3]).toEqual(updatedCollection.transportLines[3]);
    });

    const req = mockHttp.expectOne(url + '/replace');
    expect(req.request.method).toBe('POST');
    req.flush(updatedCollection.transportLines);
  }));

});
