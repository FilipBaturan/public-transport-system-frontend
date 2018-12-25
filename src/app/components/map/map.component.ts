import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { TransportLineViewer, TransportLineCollection } from '../../model/transport-line.model';
import { Station, StationCollection } from 'src/app/model/station.model';
import { StationPosition, TransportLinePosition } from 'src/app/model/position.model';
import { StationService } from 'src/app/services/station.service';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { TransportLineService } from 'src/app/services/transport-line.service';
import { TransportLine } from 'src/app/model/transport-line.model';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { MapService } from 'src/app/services/map.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

declare var MapBBCode: any;
declare var L: any;

const refresher = interval(2000);

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  // map atributes
  private mapBB: any;
  private mapViewer: any;
  private bbCode: string;
  private imagePath: string;
  private busIcon: any;
  private metroIcon: any;
  private tramIcon: any;
  private busStationIcon: any;
  private metroStationIcon: any;
  private tramStationIcon: any;

  // collections of entities
  private stations: Station[];
  private mapViewStations: object;
  private mapEditorStations: object;
  private stationCounter: number;
  private transportLines: TransportLine[];
  private transportLineViewers: TransportLineViewer[];
  private tempTransportLines: TransportLine[];
  private editTransprotLine: TransportLine;

  // form attributes
  private formGroup: FormGroup;
  private isValidFormSubmitted: boolean;
  private modalForm: NgbModalRef;

  constructor(private stationService: StationService, 
    private transportLineService: TransportLineService,
    private userService: UserService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private mapService: MapService) {
    // map init
    this.bbCode = "[map][/map]";
    this.imagePath = "assets/lib/dist/lib/images/";
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

    // collections of entities init
    this.mapViewStations = {};
    this.stationCounter = 0;
    this.transportLineViewers = [];
    this.tempTransportLines = []; 

    // form init
    this.isValidFormSubmitted = null;
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required,
         Validators.minLength(1), Validators.maxLength(30)]),
      type: new FormControl(null, [Validators.required])
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
        this.transportLineViewers.push(new TransportLineViewer(tl.id, tl.name, tl.positions, tl.schedule, tl.active,
          tl.type, tl.zone, true));
        this.showRoute(tl.id);
      }
    });
    

    var b1 = L.marker([45.26377, 19.82895], { icon: this.busIcon }).addTo(this.mapViewer.map).bindPopup("<p>bus1</p>");
    var m1 = L.marker([45.24398, 19.82504], { icon: this.metroIcon }).addTo(this.mapViewer.map).bindPopup("<p>metro1</p>");
    var t1 = L.marker([45.25229, 19.83685], { icon: this.tramIcon }).addTo(this.mapViewer.map).bindPopup("<p>tram</p>");
    //refresher.subscribe(() => this.b1.setLatLng(this.positions[(++this.bus1PositionIndex) % this.positions.length]));
  }

  edit(): void {
    var tempThis = this;          // temploral reference to this object
    var original = document.getElementById("original");
    original.style.display = "none";
    this.mapEditorStations = this.deepCopyStations();
    this.mapBB.editor("edit", this.bbCode, this.mapEditorStations, this.stationCounter, {
      "bus": this.busStationIcon,
      "metro": this.metroStationIcon,
      "tram": this.tramStationIcon
    }, function (res: string) {
      original.style.display = "block";
      if (res !== null) {
        tempThis.applyTransportRoutesChanges(res);
        tempThis.transportLineService.replaceTransportLines(
          new TransportLineCollection(tempThis.tempTransportLines)).subscribe(
            response => {
              tempThis.bbCode = "[map][/map]";
              tempThis.transportLines = response;
              tempThis.transportLineViewers = [];
              if (!tempThis.transportLines.length){
                tempThis.mapViewer.updateBBCode(tempThis.bbCode);
              }else{
                for (let index = 0; index < tempThis.transportLines.length; index++) {
                  const tl = tempThis.transportLines[index];
                  tempThis.transportLineViewers.push(new TransportLineViewer(tl.id, tl.name, tl.positions, tl.schedule, tl.active,
                    tl.type, tl.zone, true));
                    tempThis.showRoute(tl.id);
                }
              }
              
            }, error => error != undefined ? 
            this.toastrService.error(error) : 
            this.toastrService.error("Error happend, could not save changes for lines!"));
        tempThis.placeStations();
        tempThis.stationService.replaceStations(new StationCollection(tempThis.stations)).subscribe(
          stations => {
            tempThis.stations = stations;
            tempThis.drawStations();
          }, error => error != undefined ? 
            this.toastrService.error(error) : 
            this.toastrService.error("Error happend, could not save changes for stations!"));
      }
    });
  }

  editRoute(id: number, content: any): void {
    this.editTransprotLine = this.transportLines.find(v => v.id == id);
      this.name.setValue(this.editTransprotLine.name);
      this.type.setValue(this.editTransprotLine.type);
      this.open(content);
    
  }

  onFormSubmit(): void {
    this.isValidFormSubmitted = false;
    if (this.formGroup.invalid) {
       return;
    }
    this.isValidFormSubmitted = true;
    this.editTransprotLine.name = this.name.value;
    this.editTransprotLine.type = this.type.value;
    this.transportLineService.create(this.editTransprotLine).subscribe(result=> {
            let transportLine: TransportLine = result as TransportLine;
            let index: number = this.transportLines.findIndex(t => t.id == transportLine.id);
            let trannsprotViewer: TransportLineViewer = this.transportLineViewers
              .find(t => t.id == transportLine.id);
            this.transportLines[index] = transportLine;
            trannsprotViewer.name = transportLine.name;
            trannsprotViewer.type = transportLine.type;
            this.modalForm.close();
            this.toastrService.success("Transport line successfully saved!");
            this.formGroup.reset();
         });
  }
  open(content: any) {
    this.modalForm = this.modalService.open(content, 
      {ariaLabelledBy: 'modal-basic-title', size: "sm"});
  }

  private drawStations(): void {
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
        .bindPopup("<p>" + station.name + "<p>");
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

  private applyTransportRoutesChanges(code: string): void {
    if (/^\[map(=.+)?\]\[\/map\]/.test(code)){
      return
    }
    this.transportLineViewers = [];
    this.tempTransportLines = [];
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
          let old: TransportLine = this.findTransportLine(name);
          if (old != null){
            this.tempTransportLines.push(new TransportLine(old.id, name,
              new TransportLinePosition(old.positions.id, this.parsePositions(code, index), true),
              old.schedule, true, old.type, old.zone));
          }else{
            this.tempTransportLines.push(new TransportLine(null, name,
              new TransportLinePosition(null, this.parsePositions(code, index), true),
              new Array<number>(), true, "BUS", 1));
          }
          
        }
      }
    }
    index = code.lastIndexOf("[");
    if (code[index - 1] != ")") {
      code = code.slice(0, index).concat("(blue|gener@ted" + index + ")[" + code.substr(index + 1));
      this.tempTransportLines.push(new TransportLine(null, "gener@ted" + index,
       new TransportLinePosition(null, this.parsePositions(code, code.lastIndexOf("[")), true),
       new Array<number>(), true, "BUS", 1));
    } else {
      let name: string;
      ({ code, name, index } = this.generateNameToContent(code, index, false));
      let old: TransportLine = this.findTransportLine(name);
          if (old != null){
            this.tempTransportLines.push(new TransportLine(old.id, name,
              new TransportLinePosition(old.positions.id, this.parsePositions(code, code.lastIndexOf("[")),
               true), old.schedule, true, old.type, old.zone));
          }else{
            this.tempTransportLines.push(new TransportLine(null, name,
              new TransportLinePosition(null, this.parsePositions(code, code.lastIndexOf("[")), true),
              new Array<number>(), true, "BUS", 1));
          }
    }
  }

  private findTransportLine(transportLineName:string): TransportLine {
      for (const transportLine of this.transportLines) {
        if (transportLine.name == transportLineName){
          return transportLine;
        }
      }
      return null;
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

  private deepCopyStations(): any {
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
    let transportRoute : TransportLineViewer = this.transportLineViewers
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
    let routeCode: string = this.transportLineViewers
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
    let nameIndex: number = code.indexOf(this.transportLineViewers
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

  private get name() {
    return this.formGroup.get("name");
   }
  
  private get type() {
    return this.formGroup.get("type");
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