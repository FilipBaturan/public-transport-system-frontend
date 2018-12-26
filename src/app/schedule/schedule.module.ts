import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ScheduleComponent } from './schedule/schedule.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: 'schedule', component: ScheduleComponent},
    ])
  ],
  exports: [
    ScheduleComponent,
    RouterModule
  ]
})
export class ScheduleModule { }
