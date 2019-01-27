import { TestBed } from '@angular/core/testing';

import { MapService } from './map.service';
import { Station } from 'src/app/model/station.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { TrackedVehicle } from 'src/app/model/vehicle.model';
import { Component } from '@angular/core';

declare var L: any;

@Component({
  selector: 'app-map',
  template: '<div id=original></div>',
})
class FakeMapComponent {

  constructor() { }

}

describe('MapService', () => {

  const fakeMapViewer = {
    map: { removeLayer(layer: any) { } }
  };

  const busIcon = L.icon({
    iconUrl: 'bus.png', shadowUrl: 'marker-shadow.png', iconSize: [33, 50], shadowSize: [50, 64],
    iconAnchor: [18, 54], shadowAnchor: [4, 62], popupAnchor: [0, -46]
  });
  const metroIcon = L.icon({
    iconUrl: 'metro.png', shadowUrl: 'marker-shadow.png', iconSize: [33, 50], shadowSize: [50, 64],
    iconAnchor: [20, 54], shadowAnchor: [4, 62], popupAnchor: [0, -46]
  });
  const tramIcon = L.icon({
    iconUrl: 'tram.png', shadowUrl: 'marker-shadow.png', iconSize: [33, 50], shadowSize: [50, 64],
    iconAnchor: [23, 57], shadowAnchor: [4, 62], popupAnchor: [-2, -46]
  });

  let trackedVehicles: TrackedVehicle[];
  let service: MapService;

  beforeEach(() => {

    trackedVehicles = [
      { id: 1, name: 'V1', vehicleType: VehicleType.BUS, latitude: 45.32, longitude: 74.16, active: true },
      { id: 2, name: 'V2', vehicleType: VehicleType.BUS, latitude: 23.71, longitude: 36.43, active: true },
      { id: 3, name: 'V3', vehicleType: VehicleType.BUS, latitude: 53.27, longitude: 63.82, active: true }
    ];

    TestBed.configureTestingModule({
      declarations: [
        FakeMapComponent
      ]
    });

    TestBed.createComponent(FakeMapComponent);
    service = TestBed.get(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upgrade code with new transport line name that has color and no width', () => {
    const bbCode = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 (red|);
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5);
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668(purple,w10|M3)[/map]`;

    const { code, name, index } = service.generateNameToContent(bbCode, bbCode.indexOf(';'), true);
    expect(name).toBe('gener@ted' + bbCode.indexOf(';'));
    expect(index).toBe(bbCode.indexOf(';') + name.length);
    expect(code.indexOf(name)).toBeGreaterThan(0);
  });

  it('should not upgrade code with new transport line name that has no color and width', () => {
    const bbCode = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878(;
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5);
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668(purple,w10|M3)[/map]`;

    const { code, name, index } = service.generateNameToContent(bbCode, bbCode.indexOf(';'), true);
    expect(name).toBe('gener@ted' + bbCode.indexOf(';'));
    expect(index).toBe(bbCode.indexOf(';'));
    expect(code.indexOf(name)).toBeLessThan(0);
  });

  it('should upgrade code with new transport line name that has width and no color', () => {
    const bbCode = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 (,w7|);
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5);
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668(purple,w10|M3)[/map]`;

    const { code, name, index } = service.generateNameToContent(bbCode, bbCode.indexOf(';'), true);
    expect(name).toBe('gener@ted' + bbCode.indexOf(';'));
    expect(index).toBeGreaterThan(bbCode.indexOf(';'));
    expect(code.indexOf(name)).toBeGreaterThan(0);
  });

  it('should upgrade code with transport line that has width, color and name', () => {
    const bbCode = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 (red,w7|R1);
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5);
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668(purple,w10|M3)[/map]`;

    const { code, name, index } = service.generateNameToContent(bbCode, bbCode.indexOf(';'), true);
    expect(name).toBe('R1');
    expect(index).toBe(bbCode.indexOf(';'));
    expect(code.indexOf(name)).toBeGreaterThan(0);
  });

  it('should place stations on map', () => {
    const cnt = 5;
    const viewersStation: object = { 1: L.marker([35.45, 45.23]), 2: L.marker([23.14, 8.36]) };
    const editorStation: object = { 2: L.marker([35.45, 45.23]), 3: L.marker([23.14, 8.36]) };
    const stations: Station[] = [
      { id: 1, name: 'S1', position: { id: 1, latitude: 45.23, longitude: 86.12, active: true }, type: VehicleType.BUS, active: true },
      { id: 2, name: 'S2', position: { id: 2, latitude: 14.72, longitude: 27.46, active: true }, type: VehicleType.METRO, active: true },
    ];

    const counter: number = service.placeStations(fakeMapViewer, viewersStation, editorStation, stations, cnt);
    expect(counter).toBe(cnt + Object.keys(editorStation).length);
    expect(stations.length).toBe(Object.keys(editorStation).length);
  });

  it('should make deep copy of stations', () => {
    const busStationIcon: any = L.icon({
      iconUrl: '', shadowUrl: '', iconSize: [33, 50], shadowSize: [50, 64],
      iconAnchor: [18, 54], shadowAnchor: [4, 62], popupAnchor: [0, -46]
    });
    const metroStationIcon: any = L.icon({
      iconUrl: '', shadowUrl: '', iconSize: [33, 50], shadowSize: [50, 64],
      iconAnchor: [18, 54], shadowAnchor: [4, 62], popupAnchor: [0, -46]
    });
    const tramStationIcon: any = L.icon({
      iconUrl: '', shadowUrl: '', iconSize: [33, 50], shadowSize: [50, 64],
      iconAnchor: [18, 54], shadowAnchor: [4, 62], popupAnchor: [0, -46]
    });

    const stations: Station[] = [
      { id: 1, name: 'S1', position: { id: 1, latitude: 45.23, longitude: 86.12, active: true }, type: VehicleType.BUS, active: true },
      { id: 2, name: 'S2', position: { id: 2, latitude: 14.72, longitude: 27.46, active: true }, type: VehicleType.METRO, active: true },
      { id: 3, name: 'S3', position: { id: 2, latitude: 14.72, longitude: 27.46, active: true }, type: VehicleType.TRAM, active: true }
    ];

    const clone: object = service.deepCopyStations(stations, busStationIcon, metroStationIcon, tramStationIcon);
    expect(Object.keys(clone).length).toBe(stations.length);
  });

  it('should not update empty map code', () => {
    const tempTransportLines: TransportLine[] = [];

    service.applyTransportRoutesChanges('[map][/map]', [], tempTransportLines);
    expect(tempTransportLines.length).toBe(0);
  });

  it('should update map code with new transport lines', () => {
    const bbCode = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 (red,w7|R1);
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5);
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668(purple,w10|M3)[/map]`;

    const transportLines: TransportLine[] = [
      {
        id: 1, name: 'R1', positions: { id: 1, content: '420 153', active: true },
        schedule: [1, 2, 3], active: true, type: VehicleType.BUS, zone: 1
      },
      {
        id: 3, name: 'V5', positions: { id: 3, content: '16 75', active: true },
        schedule: [], active: true, type: VehicleType.TRAM, zone: 1
      }
    ];
    const tempTransportLines: TransportLine[] = [];

    service.applyTransportRoutesChanges(bbCode, transportLines, tempTransportLines);
    expect(tempTransportLines.length).toBe(4);
    expect(tempTransportLines[0].name).toBe('R1');
    expect(tempTransportLines[1].name).toBe('G7');
    expect(tempTransportLines[2].name).toBe('V5');
    expect(tempTransportLines[3].name).toBe('M3');
  });

  it('should update map code with new transport lines without names', () => {
    const bbCode = `[map]45.26377,19.82895 45.26407,19.82122 45.26274,19.81878;
    45.25374,19.78947 45.24939,19.79187 45.24552,19.79419 45.24208,19.79642 (green,w7|G7);
    45.25314,19.80432 45.24728,19.80766 45.24836,19.81504 45.24927,19.82054 (brown|V5);
    45.26398,19.83019 45.26543,19.84401 45.25417,19.84208 45.24891,19.81668[/map]`;

    const transportLines: TransportLine[] = [
      {
        id: 1, name: 'G7', positions: { id: 1, content: '420 153', active: true }, schedule: [1, 2, 3],
        active: true, type: VehicleType.BUS, zone: 1
      },
      {
        id: 3, name: 'V5', positions: { id: 3, content: '16 75', active: true },
        schedule: [], active: true, type: VehicleType.TRAM, zone: 1
      }
    ];
    const tempTransportLines: TransportLine[] = [];

    service.applyTransportRoutesChanges(bbCode, transportLines, tempTransportLines);
    expect(tempTransportLines.length).toBe(4);
    expect(tempTransportLines[1].name).toBe('G7');
    expect(tempTransportLines[2].name).toBe('V5');
    expect(tempTransportLines[0].name.startsWith('gen')).toBeTruthy();
    expect(tempTransportLines[3].name.startsWith('gen')).toBeTruthy();
  });

  it('should update map code with only one transport line', () => {
    const bbCode = `[map]45.26398,19.83019 45.26543,19.84401 45.25417,19.84208
      45.24891,19.81668(purple,w10|M3)[/map]`;

    const transportLines: TransportLine[] = [
      {
        id: 1, name: 'G7', positions: { id: 1, content: '420 153', active: true },
        schedule: [1, 2, 3], active: true, type: VehicleType.BUS, zone: 1
      },
      {
        id: 4, name: 'M3', positions: { id: 4, content: '34 96', active: true }, schedule: [7, 8, 9],
        active: true, type: VehicleType.BUS, zone: 3
      }
    ];
    const tempTransportLines: TransportLine[] = [];

    service.applyTransportRoutesChanges(bbCode, transportLines, tempTransportLines);
    expect(tempTransportLines.length).toBe(1);
    expect(tempTransportLines[0].name).toBe('M3');
  });

  // it('should receive updated vehicles', () => {

  //   const temp = new MapBBCode({
  //     defaultPosition: [45.2519, 19.837],
  //     defaultZoom: 15,
  //     letterIconLength: 5,
  //     editorHeight: 600,
  //     preferStandardLayerSwitcher: false,
  //     // tslint:disable-next-line:no-shadowed-variable
  //     createLayers: function (L) {
  //       return [
  //         MapBBCode.prototype.createOpenStreetMapLayer(),
  //         L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { name: 'CycleMap' })
  //       ];
  //     }
  //   });
  //   const mapViewer = temp.show('original', '[map][/map]');

  //   service.connect({ 1: {}} , mapViewer, busIcon, metroIcon, tramIcon);
  //   // tick();
  //   service.disconnect();
  //   // expect(mockStompClient.connect).toHaveBeenCalled();

  // });
});
