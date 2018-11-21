import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import * as _ from 'underscore.deepclone'

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

  constructor() {
    this.bbCode = `[map]45.24166,19.84264(S6); 45.23876,19.83273(S5); 45.24395,19.82509(S4);
    45.24948,19.83839(S7); 45.25833,19.83341(S8); 45.26389,19.82882(S1); 
    45.26021,19.822(S2); 45.2529,19.82431(S3); 
    45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 45.26015,19.82195 
    45.25761,19.82431 45.2529,19.82431 45.24867,19.82466 45.24398,19.82504 
    45.23972,19.82552 45.23712,19.82655 45.23879,19.83264 45.24166,19.84268 
    45.24565,19.84045 45.24951,19.83839 45.25229,19.83685 45.25833,19.83341 
    45.26154,19.83174 45.26419,19.83028 45.26377,19.82891 (red|R1)[/map]`;
    this.imagePath = "assets/lib/dist/lib/images/";
    this.bus1PositionIndex = 0;
    this.positions = [[45.26377,19.82895], [45.26407,19.82122], [45.26274,19.81878], 
    [45.26015,19.82195], [45.25761,19.82431], [45.2529,19.82431], 
    [45.24867,19.82466], [45.24398,19.82504], [45.23972,19.82552], 
    [45.23712,19.82655], [45.23879,19.83264], [45.24166,19.84268], 
    [45.24565,19.84045], [45.24951,19.83839], [45.25229,19.83685], 
    [45.25833,19.83341], [45.26154,19.83174], [45.26419,19.83028], 
    [45.26377,19.82891]];
    this.mapViewStations = {};
    this.stationCounter = 5;
    this.busIcon = L.icon({
      iconUrl: this.imagePath + "bus.png",
      shadowUrl: this.imagePath + "marker-shadow.png",
      iconSize:     [33, 50], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [18, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [0, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.metroIcon = L.icon({
      iconUrl: this.imagePath + "metro.png",
      shadowUrl: this.imagePath + "marker-shadow.png",
      iconSize:     [33, 50], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [20, 54], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [0, -46] // point from which the popup should open relative to the iconAnchor
    });
    this.tramIcon = L.icon({
      iconUrl: this.imagePath + "tram.png",
      shadowUrl: this.imagePath + "marker-shadow.png",
      iconSize:     [33, 50], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [23, 57], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-2, -46] // point from which the popup should open relative to the iconAnchor
    });
  }

  ngOnInit() {
    this.mapBB = new MapBBCode({
      defaultPosition: [45.2519,19.837],
      defaultZoom: 15,
      letterIconLength: 5,
      editorHeight: 600,
      preferStandardLayerSwitcher: false,
      createLayers: function(L) { return [
          MapBBCode.prototype.createOpenStreetMapLayer(),
          L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { name: 'CycleMap' })
      ]}
    });
    this.mapViewer = this.mapBB.show('original', this.bbCode);
    this.b1 = L.marker([45.26377,19.82895], {icon: this.busIcon}).addTo(this.mapViewer.map).bindPopup("<h4>bus1</h4>");
    var m1 = L.marker([45.24398,19.82504], {icon: this.metroIcon}).addTo(this.mapViewer.map).bindPopup("<h4>metro1</h4>");
    var t1 = L.marker([45.25229,19.83685], {icon: this.tramIcon}).addTo(this.mapViewer.map).bindPopup("<h4>tram</h4>");
    //refresher.subscribe(() => this.b1.setLatLng(this.positions[(++this.bus1PositionIndex) % this.positions.length]));
  }

  edit(): void {
    var tempThis = this;          // temploral reference to this object
    var tempMap = this.mapViewer; // temploral reference to this.mapViewer object
    var original = document.getElementById("original");
    original.style.display = "none";
    this.mapEditorStations = this.deepCopyStations(this.mapViewStations);
    this.mapBB.editor("edit", this.bbCode, this.mapEditorStations, this.stationCounter , function(res) {
        original.style.display = "block";
        if( res !== null ){
            tempMap.updateBBCode(res);
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

  private deepCopyStations(original) : any{
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
}
