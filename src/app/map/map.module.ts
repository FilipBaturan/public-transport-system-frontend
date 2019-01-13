import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map/map.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { ZoneComponent } from './zone/zone.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MapComponent,
    VehicleComponent,
    ZoneComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    MapComponent,
    VehicleComponent,
    ZoneComponent,
    RouterModule,
  ]
})
export class MapModule { }
