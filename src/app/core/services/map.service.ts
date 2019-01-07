import { Injectable } from '@angular/core';

import { Station } from 'src/app/model/station.model';
import { StationPosition, TransportLinePosition } from 'src/app/model/position.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { TransportLine, TransportLineViewer } from 'src/app/model/transport-line.model';



/**
 * Provides wide range of utilities for 
 * map component
 * 
 * @export
 * @class MapService
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {


  /**
   * Creates an instance of MapService.
   * @memberof MapService
   */
  constructor() { }

  /**
   * Updates map code with transprot lines changes
   *
   * @param {string} code map code that needs to be upgraded
   * @param {TransportLineViewer[]} transportLineViewers all available transport line viewers
   * @param {TransportLine[]} transportLines all available transprot lines
   * @param {TransportLine[]} tempTransportLines temploral collection of transprot lines
   * @memberof MapService
   */
  applyTransportRoutesChanges(code: string, transportLineViewers: TransportLineViewer[],
    transportLines: TransportLine[], tempTransportLines: TransportLine[], ): void {
    if (/^\[map(=.+)?\]\[\/map\]/.test(code)) {
      return
    }
    transportLineViewers.splice(0, transportLineViewers.length);
    tempTransportLines.splice(0, tempTransportLines.length);
    let index: number;
    while (true) {
      index = code.indexOf(";", index + 1);
      if (index === -1) {
        break;
      } else {
        if (code[index - 1] != ")") {
          code = code.slice(0, index).concat("(blue|gener@ted" + index + ");" + code.substr(index + 1));
        } else {
          let name: string;
          ({ code, name, index } = this.generateNameToContent(code, index, true));
          let old: TransportLine = this.findTransportLine(name, transportLines);
          if (old != null) {
            tempTransportLines.push(new TransportLine(old.id, name,
              new TransportLinePosition(old.positions.id, this.parsePositions(code, index), true),
              old.schedule, true, old.type, old.zone));
          } else {
            tempTransportLines.push(new TransportLine(null, name,
              new TransportLinePosition(null, this.parsePositions(code, index), true),
              new Array<number>(), true, "BUS", 1));
          }

        }
      }
    }
    index = code.lastIndexOf("[");
    if (code[index - 1] != ")") {
      code = code.slice(0, index).concat("(blue|gener@ted" + index + ")[" + code.substr(index + 1));
      tempTransportLines.push(new TransportLine(null, "gener@ted" + index,
        new TransportLinePosition(null, this.parsePositions(code, code.lastIndexOf("[")), true),
        new Array<number>(), true, "BUS", 1));
    } else {
      let name: string;
      ({ code, name, index } = this.generateNameToContent(code, index, false));
      let old: TransportLine = this.findTransportLine(name, transportLines);
      if (old != null) {
        tempTransportLines.push(new TransportLine(old.id, name,
          new TransportLinePosition(old.positions.id, this.parsePositions(code, code.lastIndexOf("[")),
            true), old.schedule, true, old.type, old.zone));
      } else {
        tempTransportLines.push(new TransportLine(null, name,
          new TransportLinePosition(null, this.parsePositions(code, code.lastIndexOf("[")), true),
          new Array<number>(), true, "BUS", 1));
      }
    }
  }

  /**
   * Deep copies of all available stations
   *
   * @param {Station[]} stations all available stations
   * @param {*} busStationIcon icon for bus station
   * @param {*} metroStationIcon icon for metro station
   * @param {*} tramStationIcon icon for tram station
   * @returns {object} deep copied object
   * @memberof MapService
   */
  deepCopyStations(stations: Station[], busStationIcon: any,
    metroStationIcon: any, tramStationIcon: any): object {
    var clone = {};

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
          title: station.type + "-" + station.name
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
   * @param {string} code map code that needs to be upgraded
   * @param {number} index current parsing index
   * @param {boolean} skip is map code upgrade required 
   * @returns {ParsedData} important information for map code
   * @memberof MapService
   */
  generateNameToContent(code: string, index: number, skip: boolean): ParsedData {
    let i: number = 0;
    while (true) {
      if (code[index - 1 - i] == "(") {
        break;
      }
      ++i;
    }
    let data: string = code.slice(index - i, index - 1);
    let color: string;
    let name: string;
    let width: string;

    if (data.indexOf("|") === -1) {
      color = "blue"; name = "gener@ted" + index; width = "";
    } else {
      color = data.split("|")[0].split(",")[0];
      width = data.split("|")[0].split(",")[1] || "";
      name = data.split("|")[1];
      if (name == "") {
        name = "gener@ted" + index;
      } else {
        skip = false;
      }
      if (width == "" && color != "") {
        code = code.slice(0, index - i).concat(color + "|" + name + code.substr(index - 1));
      } else if (width != "" && color != "") {
        code = code.slice(0, index - i).concat(color + "," + width + "|" + name + code.substr(index - 1));
      } else if (width != "" && color == "") {
        code = code.slice(0, index - i).concat(width + "|" + name + code.substr(index - 1));
      }
      if (skip) {
        index = code.indexOf(";", index + 1);
      }
    }
    return new ParsedData(code, name, index);
  }

  /**
   * Places all station from map viewer to map editor
   *
   * @param {*} mapViewer that shows current state of map
   * @param {object} mapViewStations stations showed on map viewer
   * @param {object} mapEditorStations sations showed on map editor
   * @param {Station[]} stations all available stations
   * @param {number} stationCounter number od available stations
   * @returns {number} new number of available stations
   * @memberof MapService
   */
  placeStations(mapViewer: any, mapViewStations: object,
    mapEditorStations: object, stations: Station[], stationCounter: number): number {
    // remove all stations on map
    for (const key in mapViewStations) {
      if (mapViewStations.hasOwnProperty(key)) {
        mapViewer.map.removeLayer(mapViewStations[key]);
      }
    }
    // update station counter
    stationCounter += Object.keys(mapEditorStations).length;
    // place new station on map
    mapViewStations = {};
    stations.splice(0, stations.length);
    let type: string = "";
    let name: string = "";
    let latitude: number = 0;
    let longitude: number = 0;
    for (const key in mapEditorStations) {
      if (mapEditorStations.hasOwnProperty(key)) {
        const element = mapEditorStations[key];
        [type, name] = element.options.title.split("-");
        ({ lat: latitude, lng: longitude } = element.getLatLng());
        stations.push(new Station(null, name, new StationPosition(null, latitude, longitude, true),
          VehicleType[type.toUpperCase()], true));
      }
    }
    return stationCounter;
  }

  /**
   * Finds transport line by name from all 
   * available transport lines
   *
   * @private
   * @param {string} transportLineName name of target transport line
   * @param {TransportLine[]} transportLines all available transport lines
   * @returns {TransportLine} found transport line
   * @memberof MapService
   */
  private findTransportLine(transportLineName: string, transportLines: TransportLine[]): TransportLine {
    for (const transportLine of transportLines) {
      if (transportLine.name == transportLineName) {
        return transportLine;
      }
    }
    return null;
  }

  /**
   * Exctracts positions from map code
   *
   * @private
   * @param {string} code map code from which positions need to be exctracted
   * @param {number} index current parsing index
   * @returns {string} exctracted positions
   * @memberof MapService
   */
  private parsePositions(code: string, index: number): string {
    let beginTerminalIndex: number = index;
    let i: number = 1;
    while (true) {
      if (code[index - i] == ";" || code[index - i] == "]") {
        break;
      }
      ++i; --beginTerminalIndex;
    }
    return code.substring(beginTerminalIndex, index);
  }
}

/**
 * Contains important information about parsing
 * the map content
 *
 * @class ParsedData
 */
class ParsedData {

  code: string;
  name: string;
  index: number;

  /**
   * Creates an instance of ParsedData.
   * @param {string} code map code content
   * @param {string} name transport line name
   * @param {number} index current parsing index
   * @memberof ParsedData
   */
  constructor(code: string, name: string, index: number) {
    this.code = code;
    this.name = name;
    this.index = index;
  }
}
