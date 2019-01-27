import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TransportLineViewer } from '../../model/transport-line.model';
import { Station } from 'src/app/model/station.model';
import { VehicleType } from 'src/app/model/enums/vehicle-type.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StationService } from 'src/app/core/services/station.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { UserService } from 'src/app/core/services/user.service';
import { MapService } from 'src/app/core/services/map.service';
import { TrackerService } from 'src/app/core/services/tracker.service';

declare var MapBBCode: any;
declare var L: any;

/**
 * Provides options for transport lines, vehicles, and
 * stations management
 * Provides real time vehicle movement simulation
 *
 * @export
 */
@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
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
  private vehicles: object;

  // form attributes
  private modalForm: NgbModalRef;
  public isValidFormSubmitted: boolean;
  public formGroup: FormGroup;

  @ViewChild('content') modalFormElement: ElementRef;

  /**
   * Creates an instance of MapComponent.
   * @param StationService stationService REST service for stations
   * @param TransportLineService transportLineService REST service for transport lines
   * @param UserService userService REST service for user
   * @param ToastrService toastrService user notification service
   * @param NgbModal modalService modal form service
   * @param MapService mapService map service
   * @param TrackerService trackerService tracking service
   */
  constructor(public userService: UserService,
    private stationService: StationService,
    private transportLineService: TransportLineService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private mapService: MapService,
    private trackerService: TrackerService) {
    // map init
    this.bbCode = '[map][/map]';
    this.imagePath = 'assets/lib/dist/lib/images/';
    this.busIcon = L.icon({
      iconUrl: this.imagePath + 'bus.png',
      shadowUrl: this.imagePath + 'marker-shadow.png',
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [18, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [0, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.metroIcon = L.icon({
      iconUrl: this.imagePath + 'metro.png',
      shadowUrl: this.imagePath + 'marker-shadow.png',
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [20, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [0, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.tramIcon = L.icon({
      iconUrl: this.imagePath + 'tram.png',
      shadowUrl: this.imagePath + 'marker-shadow.png',
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [23, 57], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [-2, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.busStationIcon = L.icon({
      iconUrl: this.imagePath + 'bus_station_icon.png',
      shadowUrl: this.imagePath + 'marker-shadow.png',
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [18, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [0, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.metroStationIcon = L.icon({
      iconUrl: this.imagePath + 'metro_station_icon.png',
      shadowUrl: this.imagePath + 'marker-shadow.png',
      iconSize: [33, 50], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [18, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor: [0, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.tramStationIcon = L.icon({
      iconUrl: this.imagePath + 'tram_station_icon.png',
      shadowUrl: this.imagePath + 'marker-shadow.png',
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
    this.vehicles = {};

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
   */
  ngOnInit() {

    this.mapBB = new MapBBCode({
      defaultPosition: [45.2519, 19.837],
      defaultZoom: 15,
      letterIconLength: 5,
      editorHeight: 600,
      preferStandardLayerSwitcher: false,
      // tslint:disable-next-line:no-shadowed-variable
      createLayers: function (L) {
        return [
          MapBBCode.prototype.createOpenStreetMapLayer(),
          L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { name: 'CycleMap' })
        ];
      }
    });
    this.mapViewer = this.mapBB.show('original', this.bbCode);
    this.stationService.findAll().subscribe(response => {
      this.stations = response;
      this.drawStations();
      this.stationCounter = Math.max.apply(Math, this.stations.map(function (s) { return s.id; })) + 1;
    }, err => this.toastrService.error(err));

    this.transportLineService.findAll().subscribe(response => {
      this.transportLines = response;
      for (let index = 0; index < this.transportLines.length; index++) {
        const tl = this.transportLines[index];
        this.transportLineViewers.push({id: tl.id, name: tl.name, positions: tl.positions, schedule: tl.schedule,
           active: tl.active, type:  tl.type, zone: tl.zone, visible: true});
        this.showRoute(tl.id);
      }
    }, err => this.toastrService.error(err));

    this.trackerService.connect(this.vehicles, this.mapViewer, this.busIcon, this.metroIcon, this.tramIcon);
  }

  ngOnDestroy(): void {
    this.trackerService.disconnect();
  }

  /**
   * Opens map editor and saves updates
   */
  edit(): void {
    this.trackerService.disconnect();
    const _this = this; // temploral reference to this object
    const original = document.getElementById('original');
    original.style.display = 'none';
    this.mapEditorStations = this.mapService.deepCopyStations(this.stations, this.busStationIcon,
      this.metroStationIcon, this.tramStationIcon);
    this.mapBB.editor('edit', this.bbCode, this.mapEditorStations, this.stationCounter, {
      'bus': this.busStationIcon,
      'metro': this.metroStationIcon,
      'tram': this.tramStationIcon
    }, function (res: string) {
      original.style.display = 'block';
      if (res !== null) {
        _this.mapService.applyTransportRoutesChanges(res, _this.transportLines,
          _this.tempTransportLines);
        _this.transportLineService.replaceTransportLines(
          {transportLines: _this.tempTransportLines}).subscribe(
            response => {
              _this.bbCode = '[map][/map]';
              _this.transportLines = response;
              _this.transportLineViewers = [];
              if (!_this.transportLines.length) {
                _this.mapViewer.updateBBCode(_this.bbCode);
              } else {
                for (let index = 0; index < _this.transportLines.length; index++) {
                  const tl = _this.transportLines[index];
                  _this.transportLineViewers.push({id: tl.id, name: tl.name, positions: tl.positions, schedule: tl.schedule,
                    active: tl.active, type: tl.type, zone: tl.zone, visible: true});
                  _this.showRoute(tl.id);
                }
              }

            }, error => _this.toastrService.error(error));
            const temp: Station[] = [];
            _this.stations.forEach(s => temp.push({id: s.id, name: s.name, type: s.type, active: s.active,
              position: {id: s.position.id, latitude: s.position.latitude, longitude: s.position.longitude, active: s.position.active} }));
        _this.stationCounter = _this.mapService.placeStations(_this.mapViewer,
          _this.mapViewStations, _this.mapEditorStations, _this.stations, _this.stationCounter);
        _this.stationService.replaceStations({stations: _this.stations}).subscribe(
          stations => {
            _this.stations = stations;
            _this.drawStations();
          }, error => {
            _this.toastrService.error(error);
            _this.stations = temp;
            _this.drawStations();
          });
      }
    });
    this.trackerService.connect(this.vehicles, this.mapViewer, this.busIcon, this.metroIcon, this.tramIcon);
  }

  /**
   * Provides edit option for transport line
   *
   * @param number id transport line id
   * @param any content modal form content
   */
  editRoute(id: number, content: any): void {
    this.editTransprotLine = this.transportLines.find(v => v.id === id);
    this.name.setValue(this.editTransprotLine.name);
    this.type.setValue(this.editTransprotLine.type);
    this.open(content);
  }

  /**
   * Sumbits modal form and update transport line changes
   */
  onFormSubmit(): void {
    this.isValidFormSubmitted = false;
    if (this.formGroup.invalid) {
      return;
    }
    this.isValidFormSubmitted = true;
    const nameToReplace: string = this.editTransprotLine.name;
    this.editTransprotLine.positions.content = this.editTransprotLine
      .positions.content.replace(nameToReplace, this.name.value);
    this.editTransprotLine.name = this.name.value;
    this.editTransprotLine.type = this.type.value;
    this.transportLineService.create(this.editTransprotLine).subscribe(result => {
      const transportLine: TransportLine = result as TransportLine;
      const index: number = this.transportLines.findIndex(t => t.id === transportLine.id);
      const trannsprotViewer: TransportLineViewer = this.transportLineViewers
        .find(t => t.id === transportLine.id);
      this.transportLines[index] = transportLine;
      trannsprotViewer.name = transportLine.name;
      trannsprotViewer.type = transportLine.type;
      this.modalForm.close();
      this.bbCode = this.bbCode.replace(nameToReplace, transportLine.name);
      this.mapViewer.updateBBCode(this.bbCode);
      this.toastrService.success('Transport line successfully saved!');
      this.formGroup.reset();
    }, error => this.toastrService.error(error));
  }

  /**
   * Opens modal form for transport line
   *
   * @param any content modal form content
   */
  open(content: any): void {
    this.modalForm = this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title', size: 'sm' });
  }

  /**
   * Shows/Hides transport line on map
   *
   * @param number id transport line id
   */
  toogleShowRoute(id: number): void {
    const transportRoute: TransportLineViewer = this.transportLineViewers
      .filter(tr => tr.id === id)[0];
    if (transportRoute.active) {
      this.hideRoute(id);
      transportRoute.active = false;
    } else {
      this.showRoute(id);
      transportRoute.active = true;
    }
  }

  /**
   * Draws stations on map
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
        .bindPopup('<p>' + station.name + '<p>');
    });
  }

  /**
   * Hides target transport line on map
   *
   * @param number id transport line id
   */
  private hideRoute(id: number): void {
    let code: string = this.bbCode + '';
    const nameIndex: number = code.indexOf(this.transportLineViewers
      .filter(transportRoute => transportRoute.id === id )[0].name);
    let beginTerminalSymbloIndex: number = nameIndex;
    let endTerminalSymbolIndex: number = code.indexOf(';', nameIndex);
    if (endTerminalSymbolIndex === -1) {
      endTerminalSymbolIndex = code.indexOf('[', nameIndex) - 1;
    }
    let i = 0;
    while (true) {
      if (code[nameIndex - i] === ';') {
        break;
      } else if (code[nameIndex - i] === ']') {
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

  /**
   * Show target transport line on map
   *
   * @param number id transport line id
   */
  private showRoute(id: number): void {
    let code: string = this.bbCode + '';
    let suffix = '';
    const routeCode: string = this.transportLineViewers
      .filter(transportRoute => transportRoute.id === id)[0].positions.content;
    const index: number = this.bbCode.lastIndexOf('[');
    if (code.indexOf(';') === -1 && code[index - 1] !== ')') { // routes are not shown
      suffix = routeCode + code.substr(index);
    } else {
      suffix = ';' + routeCode + code.substr(index);
    }
    code = code.slice(0, index).concat(suffix);
    this.bbCode = code;
    this.mapViewer.updateBBCode(this.bbCode);
  }

  private get name() {
    return this.formGroup.get('name');
  }

  private get type() {
    return this.formGroup.get('type');
  }
}
