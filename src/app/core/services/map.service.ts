import { Injectable } from '@angular/core';

import { Station } from 'src/app/model/station.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { ParsedData } from 'src/app/model/util.model';

/**
 * Provides wide range of utilities for map component
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {

  /**
   * Creates an instance of MapService.
   */
  constructor() {}

  /**
   * Updates map code with transprot lines changes
   *
   * @param string code map code that needs to be upgraded
   * @param TransportLineViewer[] transportLineViewers all available transport line viewers
   * @param TransportLine[] transportLines all available transprot lines
   * @param TransportLine[] tempTransportLines temploral collection of transprot lines
   */
  applyTransportRoutesChanges(code: string, transportLines: TransportLine[],
    tempTransportLines: TransportLine[]): void {
    if (/^\[map(=.+)?\]\[\/map\]/.test(code)) {
      return;
    }
    tempTransportLines.splice(0, tempTransportLines.length);
    let index: number;
    while (true) {
      index = code.indexOf(';', index + 1);
      if (index === -1) {
        break;
      } else {
        if (code[index - 1] !== ')') {
          code = code.slice(0, index).concat('(blue|gener@ted' + index + ');' + code.substr(index + 1));
        } else {
          let name: string;
          ({ code, name, index } = this.generateNameToContent(code, index, true));
          const old: TransportLine = this.findTransportLine(name, transportLines);
          if (old != null) {
            tempTransportLines.push({
              id: old.id, name: name,
              positions: { id: old.positions.id, content: this.parsePositions(code, index), active: true },
              schedule: old.schedule, active: true, type: old.type, zone: old.zone
            });
          } else {
            tempTransportLines.push({
              id: null, name: name,
              positions: { id: null, content: this.parsePositions(code, index), active: true },
              schedule: [], active: true, type: VehicleType.BUS, zone: 1
            });
          }

        }
      }
    }
    index = code.lastIndexOf('[');
    if (code[index - 1] !== ')') {
      code = code.slice(0, index).concat('(blue|gener@ted' + index + ')[' + code.substr(index + 1));
      tempTransportLines.push({
        id: null, name: 'gener@ted' + index,
        positions: { id: null, content: this.parsePositions(code, code.lastIndexOf('[')), active: true },
        schedule: [], active: true, type: VehicleType.BUS, zone: 1
      });
    } else {
      let name: string;
      ({ code, name, index } = this.generateNameToContent(code, index, false));
      const old: TransportLine = this.findTransportLine(name, transportLines);
      if (old != null) {
        tempTransportLines.push({
          id: old.id, name: name,
          positions: {
            id: old.positions.id, content: this.parsePositions(code, code.lastIndexOf('[')),
            active: true
          }, schedule: old.schedule, active: true, type: old.type, zone: old.zone
        });
      } else {
        tempTransportLines.push({
          id: null, name: name,
          positions: { id: null, content: this.parsePositions(code, code.lastIndexOf('[')), active: true },
          schedule: [], active: true, type: VehicleType.BUS, zone: 1
        });
      }
    }
  }

  /**
   * Deep copies of all available stations
   *
   * @param Station[] stations all available stations
   * @param any busStationIcon icon for bus station
   * @param any metroStationIcon icon for metro station
   * @param any tramStationIcon icon for tram station
   * @returns deep copied object
   */
  deepCopyStations(stations: Station[], busStationIcon: any,
    metroStationIcon: any, tramStationIcon: any): object {
    const clone = {};

    let icon_type: any;
    stations.forEach(station => {
      if (station.type === VehicleType.BUS) {
        icon_type = busStationIcon;
      } else if (station.type === VehicleType.METRO) {
        icon_type = metroStationIcon;
      } else {
        icon_type = tramStationIcon;
      }
      clone[station.id] = L.marker(
        [station.position.latitude, station.position.longitude], {
          icon: icon_type,
          clickable: true,
          draggable: true,
          title: station.type + '-' + station.name
        }).bindPopup('<label>Name: </label><input type="text" style="width: 90px;" id="' + station.id +
          '" value="' + station.name + '"><br /><br /> <input type="button" value="Delete" onclick="mapStationOperations.removeStation(' +
          station.id + ')"/>' + '<input type="button" value="Rename" onclick="mapStationOperations.renameStation(' +
          station.id + ',\'' + station.id + '\',\'' + station.type.toLowerCase() + '\')"/>');
    });
    return clone;
  }

  /**
   * Upgrades map code from current parsing index
   *
   * @param string code map code that needs to be upgraded
   * @param number index current parsing index
   * @param boolean skip is map code upgrade required
   * @returns ParsedData important information for map code
   */
  generateNameToContent(code: string, index: number, skip: boolean): ParsedData {
    let i = 0;
    while (true) {
      if (code[index - 1 - i] === '(') {
        break;
      }
      ++i;
    }
    const data: string = code.slice(index - i, index - 1);
    let color: string;
    let name: string;
    let width: string;

    if (data.indexOf('|') === -1) {
      color = 'blue'; name = 'gener@ted' + index; width = '';
    } else {
      color = data.split('|')[0].split(',')[0];
      width = data.split('|')[0].split(',')[1] || '';
      name = data.split('|')[1];
      if (name === '') {
        name = 'gener@ted' + index;
      } else {
        skip = false;
      }
      if (width === '' && color !== '') {
        code = code.slice(0, index - i).concat(color + '|' + name + code.substr(index - 1));
      } else if (width !== '' && color !== '') {
        code = code.slice(0, index - i).concat(color + ',' + width + '|' + name + code.substr(index - 1));
      } else { // (width != "" && color == "")
        code = code.slice(0, index - i).concat(width + '|' + name + code.substr(index - 1));
      }
      if (skip) {
        index = code.indexOf(';', index + 1);
      }
    }
    return { code: code, name: name, index: index };
  }

  /**
   * Places all station from map viewer to map editor
   *
   * @param any mapViewer that shows current state of map
   * @param object mapViewStations stations showed on map viewer
   * @param object mapEditorStations sations showed on map editor
   * @param Station[] stations all available stations
   * @param number stationCounter number od available stations
   * @returns new number of available stations
   */
  placeStations(mapViewer: any, mapViewStations: object,
    mapEditorStations: object, stations: Station[], stationCounter: number): number {
    // remove all stations on map
    for (const key in mapViewStations) {
      mapViewer.map.removeLayer(mapViewStations[key]);
    }
    // update station counter
    stationCounter += Object.keys(mapEditorStations).length;
    // place new station on map
    mapViewStations = {};
    stations.splice(0, stations.length);
    let type = '';
    let name = '';
    let latitude = 0;
    let longitude = 0;
    for (const key in mapEditorStations) {
      const element = mapEditorStations[key];
      [type, name] = element.options.title.split('-');
      ({ lat: latitude, lng: longitude } = element.getLatLng());
      stations.push({
        id: null, name: name, position: { id: null, latitude: latitude, longitude: longitude, active: true },
        type: VehicleType[type.toUpperCase()], active: true
      });
    }
    return stationCounter;
  }

  /**
   * Finds transport line by name from all
   * available transport lines
   *
   * @param string transportLineName name of target transport line
   * @param TransportLine[] transportLines all available transport lines
   * @returns found transport line
   */
  private findTransportLine(transportLineName: string, transportLines: TransportLine[]): TransportLine {
    for (const transportLine of transportLines) {
      if (transportLine.name === transportLineName) {
        return transportLine;
      }
    }
    return null;
  }

  /**
   * Exctracts positions from map code
   *
   * @param string code map code from which positions need to be exctracted
   * @param number index current parsing index
   * @returns exctracted positions
   */
  private parsePositions(code: string, index: number): string {
    let beginTerminalIndex: number = index;
    let i = 1;
    while (true) {
      if (code[index - i] === ';' || code[index - i] === ']') {
        break;
      }
      ++i; --beginTerminalIndex;
    }
    return code.substring(beginTerminalIndex, index);
  }
}
