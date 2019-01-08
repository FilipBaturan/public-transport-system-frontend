import { TestBed } from '@angular/core/testing';

import { MapService } from './map.service';
import { Station } from 'src/app/model/station.model';
import { StationPosition, TransportLinePosition } from 'src/app/model/position.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { TransportLine } from 'src/app/model/transport-line.model';

declare var L: any;

describe('MapService', () => {

  let fakeMapViewer = {
    map: { removeLayer(layer: any) { } }
  };

  let service: MapService;

  beforeEach(() => {

    TestBed.configureTestingModule({});

    service = TestBed.get(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upgrade code with new transport line name that has color and no width', () => {
    let bbCode: string = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 (red|);
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5); 
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668(purple,w10|M3)[/map]`;

    let { code, name, index } = service.generateNameToContent(bbCode, bbCode.indexOf(';'), true);
    expect(name).toBe('gener@ted' + bbCode.indexOf(';'));
    expect(index).toBe(bbCode.indexOf(';') + name.length);
    expect(code.indexOf(name)).toBeGreaterThan(0);
  });

  it('should not upgrade code with new transport line name that has no color and width', () => {
    let bbCode: string = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878(;
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5); 
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668(purple,w10|M3)[/map]`;

    let { code, name, index } = service.generateNameToContent(bbCode, bbCode.indexOf(';'), true);
    expect(name).toBe('gener@ted' + bbCode.indexOf(';'));
    expect(index).toBe(bbCode.indexOf(';'));
    expect(code.indexOf(name)).toBeLessThan(0);
  });

  it('should upgrade code with new transport line name that has width and no color', () => {
    let bbCode: string = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 (,w7|);
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5); 
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668(purple,w10|M3)[/map]`;

    let { code, name, index } = service.generateNameToContent(bbCode, bbCode.indexOf(';'), true);
    expect(name).toBe('gener@ted' + bbCode.indexOf(';'));
    expect(index).toBeGreaterThan(bbCode.indexOf(';'));
    expect(code.indexOf(name)).toBeGreaterThan(0);
  });

  it('should upgrade code with transport line that has width, color and name', () => {
    let bbCode: string = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 (red,w7|R1);
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5); 
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668(purple,w10|M3)[/map]`;

    let { code, name, index } = service.generateNameToContent(bbCode, bbCode.indexOf(';'), true);
    expect(name).toBe('R1');
    expect(index).toBe(bbCode.indexOf(';'));
    expect(code.indexOf(name)).toBeGreaterThan(0);
  });

  it('should place stations on map', () => {
    let cnt: number = 5;
    let viewersStation: object = { 1: L.marker([35.45, 45.23]), 2: L.marker([23.14, 8.36]) };
    let editorStation: object = { 2: L.marker([35.45, 45.23]), 3: L.marker([23.14, 8.36]) }
    let stations: Station[] = [
      new Station(1, "S1", new StationPosition(1, 45.23, 86.12, true), VehicleType.BUS, true),
      new Station(2, "S2", new StationPosition(2, 14.72, 27.46, true), VehicleType.METRO, true),
    ];

    let counter: number = service.placeStations(fakeMapViewer, viewersStation, editorStation, stations, cnt);
    expect(counter).toBe(cnt + Object.keys(editorStation).length);
    expect(stations.length).toBe(Object.keys(editorStation).length);
  });

  it('should make deep copy of stations', () => {
    let busStationIcon: any = L.icon({
      iconUrl: '', shadowUrl: '', iconSize: [33, 50], shadowSize: [50, 64],
      iconAnchor: [18, 54], shadowAnchor: [4, 62], popupAnchor: [0, -46]
    });
    let metroStationIcon: any = L.icon({
      iconUrl: '', shadowUrl: '', iconSize: [33, 50], shadowSize: [50, 64],
      iconAnchor: [18, 54], shadowAnchor: [4, 62], popupAnchor: [0, -46]
    });
    let tramStationIcon: any = L.icon({
      iconUrl: '', shadowUrl: '', iconSize: [33, 50], shadowSize: [50, 64],
      iconAnchor: [18, 54], shadowAnchor: [4, 62], popupAnchor: [0, -46]
    });

    let stations: Station[] = [
      new Station(1, "S1", new StationPosition(1, 45.23, 86.12, true), VehicleType.BUS, true),
      new Station(2, "S2", new StationPosition(2, 14.72, 27.46, true), VehicleType.METRO, true),
      new Station(3, "S3", new StationPosition(2, 14.72, 27.46, true), VehicleType.TRAM, true),
    ];

    let clone: object = service.deepCopyStations(stations, busStationIcon, metroStationIcon, tramStationIcon);
    expect(Object.keys(clone).length).toBe(stations.length);
  });

  it('should not update empty map code', () => {
    let tempTransportLines: TransportLine[] = [];

    service.applyTransportRoutesChanges('[map][/map]', [], tempTransportLines);
    expect(tempTransportLines.length).toBe(0);
  });

  it('should update map code with new transport lines', () => {
    let bbCode: string = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 (red,w7|R1);
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5); 
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668(purple,w10|M3)[/map]`;

    let transportLines: TransportLine[] = [
      new TransportLine(1, 'R1', new TransportLinePosition(1, '420 153', true), [1, 2, 3], true, 'BUS', 1),
      new TransportLine(3, 'V5', new TransportLinePosition(3, '16 75', true), [], true, 'TRAM', 1)
    ];
    let tempTransportLines: TransportLine[] = [];

    service.applyTransportRoutesChanges(bbCode, transportLines, tempTransportLines);
    expect(tempTransportLines.length).toBe(4);
    expect(tempTransportLines[0].name).toBe('R1');
    expect(tempTransportLines[1].name).toBe('G7');
    expect(tempTransportLines[2].name).toBe('V5');
    expect(tempTransportLines[3].name).toBe('M3');
  });

  it('should update map code with new transport lines without names', () => {
    let bbCode: string = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878;
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5); 
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668[/map]`;

    let transportLines: TransportLine[] = [
      new TransportLine(1, 'G7', new TransportLinePosition(1, '420 153', true), [1, 2, 3], true, 'BUS', 1),
      new TransportLine(3, 'V5', new TransportLinePosition(3, '16 75', true), [], true, 'TRAM', 1)
    ];
    let tempTransportLines: TransportLine[] = [];

    service.applyTransportRoutesChanges(bbCode, transportLines, tempTransportLines);
    expect(tempTransportLines.length).toBe(4);
    expect(tempTransportLines[1].name).toBe('G7');
    expect(tempTransportLines[2].name).toBe('V5');
    expect(tempTransportLines[0].name.startsWith('gen')).toBeTruthy();
    expect(tempTransportLines[3].name.startsWith('gen')).toBeTruthy();
  });

  it('should update map code with only one transport line', () => {
    let bbCode = `[map]45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 
      45.24891,19.81668(purple,w10|M3)[/map]`;

    let transportLines: TransportLine[] = [
      new TransportLine(1, 'G7', new TransportLinePosition(1, '420 153', true), [1, 2, 3], true, 'BUS', 1),
      new TransportLine(4, 'M3', new TransportLinePosition(4, '34 96', true), [7, 8, 9], true, 'BUS', 3)
    ];
    let tempTransportLines: TransportLine[] = [];

    service.applyTransportRoutesChanges(bbCode, transportLines, tempTransportLines);
    expect(tempTransportLines.length).toBe(1);
    expect(tempTransportLines[0].name).toBe('M3');
  });

});
