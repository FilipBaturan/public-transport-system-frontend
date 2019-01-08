import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

import { StationService } from './station.service';
import { Station, StationCollection } from 'src/app/model/station.model';
import { StationPosition } from 'src/app/model/position.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';

describe('StationService', () => {

  const url: string = '/api/station';
  let dbStations: Station[];

  let mockHttp: HttpTestingController;
  let service: StationService;

  beforeEach(() => {
    dbStations = [
      new Station(1, "S1", new StationPosition(1, 45.23, 86.12, true), VehicleType.BUS, true),
      new Station(2, "S2", new StationPosition(2, 14.72, 27.46, true), VehicleType.METRO, true),
      new Station(3, "S3", new StationPosition(3, 73.96, 55.67, true), VehicleType.TRAM, true),
      new Station(4, "S4", new StationPosition(4, 82.37, 43.58, true), VehicleType.BUS, true),
      new Station(5, "S5", new StationPosition(5, 93.16, 71.35, true), VehicleType.METRO, true),
    ];

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    mockHttp = TestBed.get(HttpTestingController);
    service = TestBed.get(StationService);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all available stations', fakeAsync(() => {
    service.findAll().subscribe(stations => {
      expect(stations.length).toBe(dbStations.length);
      expect(stations[0]).toEqual(dbStations[0]);
      expect(stations[1]).toEqual(dbStations[1]);
      expect(stations[2]).toEqual(dbStations[2]);
      expect(stations[3]).toEqual(dbStations[3]);
      expect(stations[4]).toEqual(dbStations[4]);
    });

    const req = mockHttp.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(dbStations);
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

  it('should create new stations and update changed stations', fakeAsync(() =>{
    let collection: StationCollection = new StationCollection([
      dbStations[0],
      dbStations[2],
      new Station(dbStations[4].id, 'S6', dbStations[4].position, dbStations[4].type, dbStations[4].active),
      new Station(null, 'S7', new StationPosition(null, 23.24, 74.86, true), VehicleType.BUS, true)
    ]);

    let updatedCollection: StationCollection = new StationCollection([
      collection[0],
      collection[1],
      collection[2],
      new Station(7, 'S7', new StationPosition(7, 23.24, 74.86, true), VehicleType.BUS, true)
    ]);

    service.replaceStations(collection).subscribe(stations =>{
      expect(stations.length).toBe(updatedCollection.stations.length);
      expect(stations[0]).toEqual(updatedCollection.stations[0]);
      expect(stations[1]).toEqual(updatedCollection.stations[1]);
      expect(stations[2]).toEqual(updatedCollection.stations[2]);
      expect(stations[3]).toEqual(updatedCollection.stations[3]);
    });

    const req = mockHttp.expectOne(url + '/replace');
    expect(req.request.method).toBe('POST');
    req.flush(updatedCollection.stations);
  }));

});
