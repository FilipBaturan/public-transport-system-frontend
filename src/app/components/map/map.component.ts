import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { TransportRoute, TransportLineCollection } from '../../model/transportRoute.model';
import { Station, StationCollection } from 'src/app/model/station.model';
import { Position, StationPosition, TransportLinePosition } from 'src/app/model/position.model';
import { Schedule } from 'src/app/model/schedule.model';
import { StationService } from 'src/app/services/station.service';
import { VehicleType } from 'src/app/model/enums/vehicle.enum';
import { TransportLineService } from 'src/app/services/transport-line.service';
import { TransportLine } from 'src/app/model/transport-line.model';

declare var MapBBCode: any;
declare var L: any;

const refresher = interval(2000);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  private mapBB: any;
  private mapViewer: any;
  private bus1PositionIndex: number;
  private positions: any[];
  private bbCode: string;
  private imagePath: string;
  private busIcon: any;
  private metroIcon: any;
  private tramIcon: any;
  private busStationIcon: any;
  private metroStationIcon: any;
  private tramStationIcon: any;
  private b1: any;
  private stations: Station[];
  private mapViewStations: object;
  private mapEditorStations: object;
  private stationCounter: number;
  private transportLines: TransportLine[];
  private transportRoutes: TransportRoute[];
  private tempTransportLines: TransportLine[];

  constructor(private stationService: StationService, 
    private transportLineService: TransportLineService) {
    this.bbCode = `[map][/map]`;
    this.imagePath = "assets/lib/dist/lib/images/";
    this.bus1PositionIndex = 0;
    this.positions = [[45.26377, 19.82895], [45.26407, 19.82122], [45.26274, 19.81878],
    [45.26015, 19.82195], [45.25761, 19.82431], [45.2529, 19.82431],
    [45.24867, 19.82466], [45.24398, 19.82504], [45.23972, 19.82552],
    [45.23712, 19.82655], [45.23879, 19.83264], [45.24166, 19.84268],
    [45.24565, 19.84045], [45.24951, 19.83839], [45.25229, 19.83685],
    [45.25833, 19.83341], [45.26154, 19.83174], [45.26419, 19.83028],
    [45.26377, 19.82891]];
    this.mapViewStations = {};
    this.stationCounter = 0;
    this.transportRoutes = [];
    this.tempTransportLines = [];
    this.busIcon = L.icon({
      iconUrl: this.imagePath + "bus.png",
      shadowUrl: this.imagePath + "marker-shadow.png",
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [18, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [0, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.metroIcon = L.icon({
      iconUrl: this.imagePath + "metro.png",
      shadowUrl: this.imagePath + "marker-shadow.png",
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [20, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [0, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.tramIcon = L.icon({
      iconUrl: this.imagePath + "tram.png",
      shadowUrl: this.imagePath + "marker-shadow.png",
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [23, 57], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-2, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.busStationIcon = L.icon({
      iconUrl: this.imagePath + "bus_station_icon.png",
      shadowUrl: this.imagePath + "marker-shadow.png",
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [18, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [0, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.metroStationIcon = L.icon({
      iconUrl: this.imagePath + "metro_station_icon.png",
      shadowUrl: this.imagePath + "marker-shadow.png",
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [18, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [0, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.tramStationIcon = L.icon({
      iconUrl: this.imagePath + "tram_station_icon.png",
      shadowUrl: this.imagePath + "marker-shadow.png",
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [18, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [0, -46] // point from which the popup should open relative to the iconAnchor
    });
  }

  ngOnInit() {

    this.mapBB = new MapBBCode({
      defaultPosition: [45.2519, 19.837],
      defaultZoom: 15,
      letterIconLength: 5,
      editorHeight: 600,
      preferStandardLayerSwitcher: false,
      createLayers: function (L) {
        return [
          MapBBCode.prototype.createOpenStreetMapLayer(),
          L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { name: 'CycleMap' })
        ]
      }
    });
    this.mapViewer = this.mapBB.show('original', this.bbCode);
    this.stationService.findAll().subscribe(response => {
      this.stations = response;
      this.drawStations();
      this.stationCounter = Math.max.apply(Math, this.stations.map(function (s) { return s.id; })) + 1;
    });

    this.transportLineService.findAll().subscribe(response => {
      this.transportLines = response;
      for (let index = 0; index < this.transportLines.length; index++) {
        const tl = this.transportLines[index];
        this.transportRoutes.push(new TransportRoute(tl.id, tl.name, tl.positions, tl.schedule, tl.active,
          tl.type, tl.zone, true));
        this.showRoute(tl.id);
      }
    });
    

    this.b1 = L.marker([45.26377, 19.82895], { icon: this.busIcon }).addTo(this.mapViewer.map).bindPopup("<h4>bus1</h4>");
    var m1 = L.marker([45.24398, 19.82504], { icon: this.metroIcon }).addTo(this.mapViewer.map).bindPopup("<h4>metro1</h4>");
    var t1 = L.marker([45.25229, 19.83685], { icon: this.tramIcon }).addTo(this.mapViewer.map).bindPopup("<h4>tram</h4>");
    //refresher.subscribe(() => this.b1.setLatLng(this.positions[(++this.bus1PositionIndex) % this.positions.length]));
  }

  edit(): void {
    var tempThis = this;          // temploral reference to this object
    var tempMap = this.mapViewer; // temploral reference to this.mapViewer object
    var original = document.getElementById("original");
    original.style.display = "none";
    this.mapEditorStations = this.deepCopyStations(this.mapViewStations);
    this.mapBB.editor("edit", this.bbCode, this.mapEditorStations, this.stationCounter, {
      "bus": this.busStationIcon,
      "metro": this.metroStationIcon,
      "tram": this.tramStationIcon
    }, function (res) {
      original.style.display = "block";
      if (res !== null) {
        tempThis.bbCode = tempThis.placeTransportRoutes(res);
        tempThis.transportLineService.replacetransportLines(
          new TransportLineCollection(tempThis.tempTransportLines)).subscribe(
            response => {
              tempThis.transportLines = response;
              tempThis.transportRoutes = [];
              for (let index = 0; index < tempThis.transportLines.length; index++) {
                const tl = tempThis.transportLines[index];
                tempThis.transportRoutes.push(new TransportRoute(tl.id, tl.name, tl.positions, tl.schedule, tl.active,
                  tl.type, tl.zone, true));
                  tempThis.showRoute(tl.id);
              }
            });
        tempThis.placeStations();
        tempThis.stationService.replaceStations(new StationCollection(tempThis.stations)).subscribe(
          stations => {
            tempThis.stations = stations;
            tempThis.drawStations();
          },error => console.log(error));
      }
    });
  }

  private drawStations() {
    let icon_type: any;
    this.stations.forEach(station => {
      if (station.type === VehicleType.BUS) {
        icon_type = this.busStationIcon;
      } else if (station.type === VehicleType.METRO) {
        icon_type = this.metroStationIcon;
      } else {
        icon_type = this.tramStationIcon;
      }
      this.mapViewStations[station.id] = L.marker(
        [station.position.latitude, station.position.longitude], { icon: icon_type })
        .addTo(this.mapViewer.map)
        .bindPopup("<h4>" + station.name + "</h4>");
    });
  }

  private placeStations(): void {
    // remove all stations on map
    for (const key in this.mapViewStations) {
      if (this.mapViewStations.hasOwnProperty(key)) {
        this.mapViewer.map.removeLayer(this.mapViewStations[key]);
      }
    }
    // update station counter
    this.stationCounter += Object.keys(this.mapEditorStations).length;
    // place new station on map
    this.mapViewStations = {};
    this.stations = new Array<Station>();
    let type: string = "";
    let name: string = "";
    let latitude: number = 0;
    let longitude: number = 0;
    for (const key in this.mapEditorStations) {
      if (this.mapEditorStations.hasOwnProperty(key)) {
        const element = this.mapEditorStations[key];
        [type, name] = element.options.title.split("-");
        ({lat: latitude, lng: longitude} = element.getLatLng());
        this.stations.push(new Station(null, name, new StationPosition(null, latitude, longitude, true),
          VehicleType[type.toUpperCase()], true));
      }
    }
  }

  private placeTransportRoutes(code: string): string {
    this.transportRoutes = [];
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
          this.tempTransportLines.push(new TransportLine(null, name,
             new TransportLinePosition(null, this.parsePositions(code, index), true),
                 new Schedule(), true, "BUS", 1));
        }
      }
    }
    index = code.lastIndexOf("[");
    if (code[index - 1] != ")") {
      code = code.slice(0, index).concat("(blue|gener@ted" + index + ")[" + code.substr(index + 1));
      this.tempTransportLines.push(new TransportLine(null, "gener@ted" + index,
       new TransportLinePosition(null, this.parsePositions(code, code.lastIndexOf("[")), true),
        new Schedule(), true, "BUS", 1));
    } else {
      let name: string;
      ({ code, name, index } = this.generateNameToContent(code, index, false));
      this.tempTransportLines.push(new TransportLine(null, name,
       new TransportLinePosition(null, this.parsePositions(code, code.lastIndexOf("[")), true),
        new Schedule(), true, "BUS", 1));
    }
    return code;
  }

  private generateNameToContent(code: string, index: number, skip: boolean): ParsedData {
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

  private parsePositions(code: string, index: number): string {
    let result: StationPosition[] = new Array<StationPosition>();
    let beginTerminalIndex: number = index;
    let i: number = 1;
    let tokens: string[];
    while (true) {
      if (code[index - i] == ";" || code[index - i] == "]") {
        break;
      }
      ++i; --beginTerminalIndex;
    }
    return code.substring(beginTerminalIndex, index);
  }

  private deepCopyStations(original): any {
    var clone = {};

    let icon_type: any;
    this.stations.forEach(station => {
      if (station.type === VehicleType.BUS) {
        icon_type = this.busStationIcon;
      } else if (station.type === VehicleType.METRO) {
        icon_type = this.metroStationIcon;
      } else {
        icon_type = this.tramStationIcon;
      }
      clone[station.id] = L.marker(
        [station.position.latitude, station.position.longitude], {
          icon: icon_type,
          clickable: true,
          draggable: true,
          title: station.type + "-" + station.name
        }).bindPopup('<label>Name: </label><input type="text" style="width: 90px;" id="' + station.id + 
				  '" value="' + station.name + '"><br /><br /> <input type="button" value="Delete" onclick="mapStationOperations.removeStation('+ 
				  station.id + ')"/>' + '<input type="button" value="Rename" onclick="mapStationOperations.renameStation(' + 
				  station.id + ',\'' + station.id + '\',\'' + station.type.toLowerCase() + '\')"/>');
    });
    return clone;
  }

  toogleShowRoute(id: number): void {
    let transportRoute : TransportRoute = this.transportRoutes
    .filter(transportRoute => {return transportRoute.id === id})[0];
    if (transportRoute.active) {
      this.hideRoute(id);
      transportRoute.active = false;
    }
    else {
      this.showRoute(id);
      transportRoute.active = true;
    }
  }

  private showRoute(id: number): void {
    let code: string = this.bbCode + "";
    let suffix: string = "";
    let routeCode: string = this.transportRoutes
    .filter(transportRoute => {return transportRoute.id === id})[0].positions.content;
    let index: number = this.bbCode.lastIndexOf("[");
    if (code.indexOf(";") === -1 && code[index - 1] != ")") { // routes are not shown
      suffix = routeCode + code.substr(index);
    } else {
      suffix = ";" + routeCode + code.substr(index);
    }
    code = code.slice(0, index).concat(suffix);
    this.bbCode = code;
    this.mapViewer.updateBBCode(this.bbCode);
  }

  private hideRoute(id: number): void {
    let code: string = this.bbCode + "";
    let nameIndex: number = code.indexOf(this.transportRoutes
      .filter(transportRoute => {return transportRoute.id === id})[0].name);
    let beginTerminalSymbloIndex: number = nameIndex;
    let endTerminalSymbolIndex: number = code.indexOf(";", nameIndex);
    if (endTerminalSymbolIndex === -1) {
      endTerminalSymbolIndex = code.indexOf("[", nameIndex) - 1;
    }
    let i: number = 0
    while (true) {
      if (code[nameIndex - i] == ";") {
        break;
      } else if (code[nameIndex - i] == "]") {
        beginTerminalSymbloIndex += 2;
        endTerminalSymbolIndex += 2;
        break;
      }
      ++i; --beginTerminalSymbloIndex;
    }

    code = code.slice(0, beginTerminalSymbloIndex - 1)
      .concat(code.slice(endTerminalSymbolIndex - 1));
    this.bbCode = code;
    this.mapViewer.updateBBCode(this.bbCode);
  }
}

class ParsedData {

  code: string;
  name: string;
  index: number;

  constructor(code: string, name: string, index: number) {
    this.code = code;
    this.name = name;
    this.index = index;
  }
}