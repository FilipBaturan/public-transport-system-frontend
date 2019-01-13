import { TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { StationService } from './station.service';
import { Station, StationCollection } from 'src/app/model/station.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';

describe('StationService', () => {

  const url = '/api/station';
  let dbStations: Station[];

  let mockHttp: HttpTestingController;
  let service: StationService;

  beforeEach(() => {
    dbStations = [
      { id: 1, name: 'S1', position: { id: 1, latitude: 45.23, longitude: 86.12, active: true }, type: VehicleType.BUS, active: true },
      { id: 2, name: 'S2', position: { id: 2, latitude: 14.72, longitude: 27.46, active: true }, type: VehicleType.METRO, active: true },
      { id: 3, name: 'S3', position: { id: 3, latitude: 73.96, longitude: 55.67, active: true }, type: VehicleType.TRAM, active: true },
      { id: 4, name: 'S4', position: { id: 4, latitude: 82.37, longitude: 43.58, active: true }, type: VehicleType.BUS, active: true },
      { id: 5, name: 'S5', position: { id: 5, latitude: 93.16, longitude: 71.35, active: true }, type: VehicleType.METRO, active: true },
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

  it('should create s and update changed stations', fakeAsync(() => {
    const collection: StationCollection = {
      stations: [
        dbStations[0],
        dbStations[2],
        { id: dbStations[4].id, name: 'S6', position: dbStations[4].position, type: dbStations[4].type, active: dbStations[4].active },
        {
          id: null, name: 'S7', position: { id: null, latitude: 23.24, longitude: 74.86, active: true },
          type: VehicleType.BUS, active: true
        }
      ]
    };

    const updatedCollection: StationCollection = {
      stations: [
        collection[0],
        collection[1],
        collection[2],
        { id: 7, name: 'S7', position: { id: 7, latitude: 23.24, longitude: 74.86, active: true }, type: VehicleType.BUS, active: true }
      ]
    };

    service.replaceStations(collection).subscribe(stations => {
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
