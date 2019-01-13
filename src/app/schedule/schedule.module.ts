import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ScheduleComponent } from './schedule/schedule.component';
import { SharedModule } from '../shared/shared.module';
import { ScheduleUpdateComponent } from './schedule-update/schedule-update.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    ScheduleUpdateComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ScheduleComponent,
    RouterModule
  ]
})
export class ScheduleModule { }
