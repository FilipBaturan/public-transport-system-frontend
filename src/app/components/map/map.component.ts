import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { TransportRoute } from '../../model/transportRoute';
import { Station } from 'src/app/model/station.model';
import { Coordinates } from 'src/app/model/coordinates.model';

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
  private b1: any;
  private mapViewStations: object;
  private mapEditorStations: object;
  private stationCounter: number;
  transportRoutes: object;

  constructor() {
    this.bbCode = `[map]
    45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 45.26015,19.82195 
    45.25761,19.82431 45.2529,19.82431 45.24867,19.82466 45.24398,19.82504 
    45.23972,19.82552 45.23712,19.82655 45.23879,19.83264 45.24166,19.84268 
    45.24565,19.84045 45.24951,19.83839 45.25229,19.83685 45.25833,19.83341 
    45.26154,19.83174 45.26419,19.83028 45.26377,19.82891 (red|R1)[/map]`;
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
    this.stationCounter = 5;
    this.transportRoutes = [];
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
    this.mapBB.editor("edit", this.bbCode, this.mapEditorStations, this.stationCounter, function (res) {
      original.style.display = "block";
      if (res !== null) {
        tempThis.bbCode = tempThis.placeTransportRoutes(res);
        tempMap.updateBBCode(tempThis.bbCode);
        tempThis.placeStations();
      }
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
    for (const key in this.mapEditorStations) {
      if (this.mapEditorStations.hasOwnProperty(key)) {
        const element = this.mapEditorStations[key];
        this.mapViewStations[key] = L.marker(element.getLatLng(), {
          icon: L.letterIcon(element.options.icon._letter, {
            radius: 14,
            color: element.options.icon.options.color
          }),
          clickable: false,
          draggable: false
        }).addTo(this.mapViewer.map);
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
          let positions: Array<Coordinates> = this.parsePositions(code, index);
          let color: string;
          let name: string;
          let width: string;
          ({ code, color, name, width, index } = this.parseNameColorWidth(code, index, true));
          this.transportRoutes[Object.keys(this.transportRoutes).length] =
            new TransportRoute(Object.keys(this.transportRoutes).length,
              name, new Array<Station>(), new Array<number>(), true, "BUS", 1, color, true, positions, width);
        }
      }
    }
    index = code.lastIndexOf("[");
    let positions: Array<Coordinates> = this.parsePositions(code, index);
    if (code[index - 1] != ")") {
      code = code.slice(0, index).concat("(blue|gener@ted" + index + ")[" + code.substr(index + 1));
      this.transportRoutes[Object.keys(this.transportRoutes).length] =
        new TransportRoute(Object.keys(this.transportRoutes).length,
          "gener@ted" + index, new Array<Station>(), new Array<number>(), true, "BUS", 1, "blue", true, positions, ""
        );
    } else {
      let color: string;
      let name: string;
      let width: string;
      ({ code, color, name, width, index } = this.parseNameColorWidth(code, index, false));
      this.transportRoutes[Object.keys(this.transportRoutes).length] =
        new TransportRoute(Object.keys(this.transportRoutes).length,
          name, new Array<Station>(), new Array<number>(), true, "BUS", 1, color, true, positions, width
        );

    }
    return code;
  }

  private parseNameColorWidth(code: string, index: number, skip: boolean): ParsedData {
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
    return new ParsedData(code, color, name, width, index);
  }

  private parsePositions(code: string, index: number): Coordinates[] {
    let result: Coordinates[] = new Array<Coordinates>();
    let beginTerminalIndex: number = index;
    let i: number = 1;
    let tokens: string[];
    while (true) {
      if (code[index - i] == ";" || code[index - i] == "]") {
        break;
      }
      ++i; --beginTerminalIndex;
    }
    tokens = code.substring(beginTerminalIndex, index).split(" ");
    if (tokens[tokens.length - 1].indexOf("(") !== -1) {
      tokens[tokens.length - 1] = tokens[tokens.length - 1].split("(")[0];
    }
    tokens = tokens.filter(function (value: string, index: number) {
      return value != "";
    })
    tokens.forEach(position => {
      let longLangTokens: string[] = position.split(",");
      let latitude: number = Number(longLangTokens[0]);
      let longitude: number = Number(longLangTokens[1]);
      result.push(new Coordinates(null, latitude, longitude));
    });
    return result;
  }

  private deepCopyStations(original): any {
    var clone = {};
    for (const key in original) {
      if (original.hasOwnProperty(key)) {
        const element = original[key];
        clone[key] = L.marker(element.getLatLng(), {
          icon: L.letterIcon(element.options.icon._letter, {
            radius: 14,
            color: element.options.icon.options.color
          }),
          clickable: false,
          draggable: false
        });
      }
    }
    return clone;
  }

  toogleShowRoute(id: number): void {
    if (this.transportRoutes[id].active) {
      this.hideRoute(id);
      this.transportRoutes[id].active = false;
    }
    else {
      this.showRoute(id);
      this.transportRoutes[id].active = true;
    }
  }

  private showRoute(id: number): void {
    let code: string = this.bbCode + "";
    let suffix: string = "";
    let routeCode: string = this.transportRoutes[id].toBBCode();
    let index: number = this.bbCode.lastIndexOf("[");
    if (code.indexOf(";") === -1 && code[index - 1] != ")") { // routes are not shown
      suffix = routeCode + code.substr(index);
    } else {
      suffix = ";" + routeCode + code.substr(index);
    }
    code = code.slice(0, index).concat(suffix);
    this.mapViewer.updateBBCode(code);
  }

  private hideRoute(id: number): void {
    let code: string = this.bbCode + "";
    let nameIndex: number = code.indexOf(this.transportRoutes[id].name);
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
    this.mapViewer.updateBBCode(code);
  }
}

class ParsedData {

  code: string;
  color: string;
  name: string;
  width: string;
  index: number;

  constructor(code: string, color: string, name: string, width: string, index: number) {
    this.code = code;
    this.color = color;
    this.name = name;
    this.width = width;
    this.index = index;
  }
}
