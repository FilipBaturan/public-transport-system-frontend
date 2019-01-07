import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { interval } from 'rxjs';
import { TransportLineViewer, TransportLineCollection } from '../../model/transport-line.model';
import { Station, StationCollection } from 'src/app/model/station.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StationService } from 'src/app/core/services/station.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { UserService } from 'src/app/core/services/user.service';
import { MapService } from 'src/app/core/services/map.service';

declare var MapBBCode: any;
declare var L: any;

const refresher = interval(2000);

/**
 * Provides options for transport lines, vehicles, and 
 * stations management 
 * Provides real time vehicle movement simulation
 *
 * @export
 * @class MapComponent
 * @implements {OnInit}
 */
@Component({
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

  /**
   * Creates an instance of MapComponent.
   * @param {StationService} stationService REST service for stations
   * @param {TransportLineService} transportLineService REST service for transport lines
   * @param {UserService} userService REST service for user
   * @param {ToastrService} toastrService user notification service
   * @param {NgbModal} modalService modal form service
   * @param {MapService} mapService map service
   * @memberof MapComponent
   */
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

  /**
   * Fetchs transport line, vehicle, station, zone data
   * Sets map configuration
   *
   * @memberof MapComponent
   */
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

  /**
   * Opens map editor and saves updates
   *
   * @memberof MapComponent
   */
  edit(): void {
    var tempThis = this;          // temploral reference to this object
    var original = document.getElementById("original");
    original.style.display = "none";
    this.mapEditorStations = this.mapService.deepCopyStations(this.stations, this.busStationIcon,
      this.metroStationIcon, this.tramStationIcon);
    this.mapBB.editor("edit", this.bbCode, this.mapEditorStations, this.stationCounter, {
      "bus": this.busStationIcon,
      "metro": this.metroStationIcon,
      "tram": this.tramStationIcon
    }, function (res: string) {
      original.style.display = "block";
      if (res !== null) {
        tempThis.mapService.applyTransportRoutesChanges(res, tempThis.transportLineViewers,
          tempThis.transportLines, tempThis.tempTransportLines);
        tempThis.transportLineService.replaceTransportLines(
          new TransportLineCollection(tempThis.tempTransportLines)).subscribe(
            response => {
              tempThis.bbCode = "[map][/map]";
              tempThis.transportLines = response;
              tempThis.transportLineViewers = [];
              if (!tempThis.transportLines.length) {
                tempThis.mapViewer.updateBBCode(tempThis.bbCode);
              } else {
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
        tempThis.stationCounter = tempThis.mapService.placeStations(tempThis.mapViewer,
          tempThis.mapViewStations, tempThis.mapEditorStations, tempThis.stations, tempThis.stationCounter);
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

  /**
   * Provides edit option for transport line
   *
   * @param {number} id transport line id
   * @param {*} content modal form content
   * @memberof MapComponent
   */
  editRoute(id: number, content: any): void {
    this.editTransprotLine = this.transportLines.find(v => v.id == id);
    this.name.setValue(this.editTransprotLine.name);
    this.type.setValue(this.editTransprotLine.type);
    this.open(content);

  }

  /**
   * Sumbits modal form and update transport
   * line changes
   *
   * @returns {void}
   * @memberof MapComponent
   */
  onFormSubmit(): void {
    this.isValidFormSubmitted = false;
    if (this.formGroup.invalid) {
      return;
    }
    this.isValidFormSubmitted = true;
    let nameToReplace: string = this.editTransprotLine.name;
    this.editTransprotLine.positions.content = this.editTransprotLine
      .positions.content.replace(nameToReplace, this.name.value);
    this.editTransprotLine.name = this.name.value;
    this.editTransprotLine.type = this.type.value;
    this.transportLineService.create(this.editTransprotLine).subscribe(result => {
      let transportLine: TransportLine = result as TransportLine;
      let index: number = this.transportLines.findIndex(t => t.id == transportLine.id);
      let trannsprotViewer: TransportLineViewer = this.transportLineViewers
        .find(t => t.id == transportLine.id);
      this.transportLines[index] = transportLine;
      trannsprotViewer.name = transportLine.name;
      trannsprotViewer.type = transportLine.type;
      this.modalForm.close();
      this.bbCode = this.bbCode.replace(nameToReplace, transportLine.name);
      this.mapViewer.updateBBCode(this.bbCode);
      this.toastrService.success("Transport line successfully saved!");
      this.formGroup.reset();
    });
  }

  /**
   * Opens modal form for transport line
   *
   * @param {*} content modal form content
   * @memberof MapComponent
   */
  open(content: any): void {
    this.modalForm = this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title', size: "sm" });
  }

  /**
   * Shows/Hides transport line on map
   *
   * @param {number} id transport line id
   * @memberof MapComponent
   */
  toogleShowRoute(id: number): void {
    let transportRoute: TransportLineViewer = this.transportLineViewers
      .filter(transportRoute => { return transportRoute.id === id })[0];
    if (transportRoute.active) {
      this.hideRoute(id);
      transportRoute.active = false;
    }
    else {
      this.showRoute(id);
      transportRoute.active = true;
    }
  }

  /**
   * Draws stations on map
   *
   * @private
   * @memberof MapComponent
   */
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

  /**
   * Hides target transport line on map
   *
   * @private
   * @param {number} id transport line id
   * @memberof MapComponent
   */
  private hideRoute(id: number): void {
    let code: string = this.bbCode + "";
    let nameIndex: number = code.indexOf(this.transportLineViewers
      .filter(transportRoute => { return transportRoute.id === id })[0].name);
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
      } else if (i > code.length) {
        return;
      }
      ++i; --beginTerminalSymbloIndex;
    }

    code = code.slice(0, beginTerminalSymbloIndex - 1)
      .concat(code.slice(endTerminalSymbolIndex - 1));
    this.bbCode = code;
    this.mapViewer.updateBBCode(this.bbCode);
  }

  /**
   * Show target transport line on map
   *
   * @private
   * @param {number} id transport line id
   * @memberof MapComponent
   */
  private showRoute(id: number): void {
    let code: string = this.bbCode + "";
    let suffix: string = "";
    let routeCode: string = this.transportLineViewers
      .filter(transportRoute => { return transportRoute.id === id })[0].positions.content;
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

  private get name() {
    return this.formGroup.get("name");
  }

  private get type() {
    return this.formGroup.get("type");
  }
}