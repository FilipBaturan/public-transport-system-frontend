import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollingModule, ScrollDispatchModule } from '@angular/cdk/scrolling';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule, MatCardModule, MatDatepickerModule, MatNativeDateModule,
  MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule,
   MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';


@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ScrollingModule,
    NavBarComponent,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    AngularMultiSelectModule,
    ScrollDispatchModule,
    RouterModule
  ]
})
export class SharedModule { }
