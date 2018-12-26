import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapComponent } from './map.component';
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
    SharedModule,
    RouterModule.forChild([
      { path: 'vehicles', component: VehicleComponent},
      { path: 'zones', component: ZoneComponent},
    ])
  ],
  exports: [
    MapComponent,
    VehicleComponent,
    ZoneComponent,
    RouterModule,
  ]
})
export class MapModule { }
