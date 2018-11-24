import { Component, OnInit } from '@angular/core';
import {MapBBCode} from "../../lib/src/MapBBCode.js";
// import {tileLayer, latLng} from 'leaflet';
// import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  

  bbCode = "[map]45.24166,19.84264(S6); 45.23876,19.83273(S5); 45.24395,19.82509(S4)" +
     "45.24948,19.83839(S7); 45.25833,19.83341(S8); 45.26389,19.82882(S1); 45.26021,19.822(S2)" +
     "45.2529,19.82431(S3); 45.26377,19.82895 45.26407,19.82122 45.26274,19.81878 45.26015,19.82195"
     "45.25761,19.82431 45.2529,19.82431 45.24867,19.82466 45.24398,19.82504 45.23972,19.82552"
     "45.23712,19.82655 45.23879,19.83264 45.24166,19.84268 45.24565,19.84045 45.24951,19.83839 "
     "45.25229,19.83685 45.25833,19.83341 45.26154,19.83174 45.26419,19.83028 45.26377,19.82891 (red|R1)[/map]"


  positions = ["45.26377,19.82895", "45.26407,19.82122", "45.26274,19.81878", 
  "45.26015,19.82195", "45.25761,19.82431", "45.2529,19.82431", 
  "45.24867,19.82466", "45.24398,19.82504", "45.23972,19.82552", 
  "45.23712,19.82655", "45.23879,19.83264", "45.24166,19.84268", 
  "45.24565,19.84045", "45.24951,19.83839", "45.25229,19.83685", 
  "45.25833,19.83341", "45.26154,19.83174", "45.26419,19.83028", 
  "45.26377,19.82891"];

  mapBB : MapBBCode;
  options : any;

  tempMarker: any;
  markersname: any;

  constructor() { }

  ngOnInit() {
  //   var mapBB = new MapBBCode({
  //     defaultPosition: [45.2519,19.837],
  //     defaultZoom: 15,
  //   preferStandardLayerSwitcher: false,
  //     createLayers: function(L) { return [
  //         MapBBCode.prototype.createOpenStreetMapLayer(),
  //         L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { name: 'CycleMap' })
  //     ]}
  // });

  // var bus1PositionIndex = 0;
  // var bus2PositionIndex = 10;


  // var newCode = this.bbCode.replace("[/map]", this.positions[bus1PositionIndex] + "(bus1 <>); " + 
  //               this.positions[bus2PositionIndex]+ "(bus2 <>)[/map]");
  // console.log(this.bbCode);
  // console.log(newCode);
  // var show = mapBB.show('test', newCode);



  }

  
}
