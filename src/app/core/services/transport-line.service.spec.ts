import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { TransportLineService } from './transport-line.service';
import { TransportLine, TransportLineCollection } from 'src/app/model/transport-line.model';
import { TransportLinePosition } from 'src/app/model/position.model';

describe('TransportLineService', () => {

  const url: string = '/api/transportLine';
  let dbTransportLines: TransportLine[];
  let newTransportLine: TransportLine = new TransportLine(7, 'T7',
    new TransportLinePosition(7, '73 17', true), [], true, 'BUS', 1)

  let mockHttp: HttpTestingController;
  let service: TransportLineService;

  beforeEach(() => {
    dbTransportLines = [
      new TransportLine(1, 'T1', new TransportLinePosition(1, '420 153', true), [1, 2, 3], true, 'BUS', 1),
      new TransportLine(2, 'T2', new TransportLinePosition(2, '85 12', true), [4, 5, 6], true, 'METRO', 2),
      new TransportLine(3, 'T3', new TransportLinePosition(3, '16 75', true), [], true, 'TRAM', 1),
      new TransportLine(4, 'T4', new TransportLinePosition(4, '34 96', true), [7, 8, 9], true, 'BUS', 3),
      new TransportLine(5, 'T5', new TransportLinePosition(5, '27 34', true), [], true, 'METRO', 1)
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
    let tl = new TransportLine(null, 'T7', new TransportLinePosition(null, '73 17', true), [], true, 'BUS', 1);
    service.create(tl).subscribe(transportLine => {
      expect(transportLine.id).toEqual(newTransportLine.id);
      expect(transportLine.name).toEqual(newTransportLine.name);
      expect(transportLine.positions).toEqual(newTransportLine.positions);
      expect(transportLine.schedule).toEqual(newTransportLine.schedule);
      expect(transportLine.active).toEqual(newTransportLine.active);
      expect(transportLine.type).toEqual(newTransportLine.type);
      expect(transportLine.zone).toEqual(newTransportLine.zone);
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('POST');
    req.flush(newTransportLine);
  }));

  it('should create new transport lines and update changed transport lines', fakeAsync(() => {
    let collection: TransportLineCollection = new TransportLineCollection([
      dbTransportLines[0],
      dbTransportLines[2],
      new TransportLine(dbTransportLines[4].id, 'T6', dbTransportLines[4].positions, dbTransportLines[4].schedule,
        dbTransportLines[4].active, dbTransportLines[4].type, dbTransportLines[4].zone),
      new TransportLine(null, 'T7', new TransportLinePosition(null, '73 17', true), [], true, 'BUS', 1)
    ]);

    let updatedCollection: TransportLineCollection = new TransportLineCollection([
      collection[0],
      collection[1],
      collection[2],
      new TransportLine(7, 'T7', new TransportLinePosition(7, '73 17', true), [], true, 'BUS', 1)
    ]);

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
