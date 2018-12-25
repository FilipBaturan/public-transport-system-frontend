import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {MatButtonModule, MatCheckboxModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatMenuModule,
     MatIconModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule} from '@angular/material';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { AppComponent } from './app.component';
import { TransportLineComponent } from './components/transport-line/transport-line.component';
import { TransportLineListComponent } from './components/transport-line-list/transport-line-list.component';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AuthComponent } from './components/auth/auth.component';
import { MapComponent } from './components/map/map.component';
import { UnconfirmedUserListComponent } from './components/unconfirmed-user-list/unconfirmed-user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ValidatorListComponent } from './components/validator-list/validator-list.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { RegUserListComponent } from './components/reg-user-list/reg-user-list.component';
import { UserTicketsComponent } from './components/user-tickets/user-tickets.component';
import { ReportComponent } from './components/report/report.component';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { NewsComponent } from './components/news/news.component';
import { NewsAdministrationComponent } from './components/news-administration/news-administration.component';

@NgModule({
  
  declarations: [
    AppComponent,
    TransportLineComponent,
    TransportLineComponent,
    TransportLineListComponent,
    WelcomeComponent,
    ScheduleComponent,
    AuthComponent,
    MapComponent,
    UnconfirmedUserListComponent,
    UserProfileComponent,
    ValidatorListComponent,
    SignupComponent,
    NavBarComponent,
    TicketsComponent,
    RegUserListComponent,
    UserTicketsComponent,
    ReportComponent,
    VehicleComponent,
    NewsComponent,
    NewsAdministrationComponent,
    
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    NgxDatatableModule,
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
    FormsModule,
    RouterModule.forRoot([
      { path: 'userTickets/:id', component: UserTicketsComponent},
      { path: 'signin', component: AuthComponent},
      { path: 'signup', component: SignupComponent},
      { path: 'schedule', component: ScheduleComponent},
      { path: 'transportLineList', component: TransportLineListComponent},
      { path: 'transportLine', component: TransportLineComponent},
      { path: 'tickets', component: TicketsComponent},
      { path: 'unconfirmedUsers', component: UnconfirmedUserListComponent},
      { path: 'userProfile', component: UserProfileComponent},
      { path: 'validators', component: ValidatorListComponent},
      { path: 'registeredUsers', component: RegUserListComponent},
      { path: 'editRoutes', component: MapComponent},
      { path: 'reports', component: ReportComponent},
      { path: 'vehicles', component: VehicleComponent},
      { path: '', redirectTo: '/welcome', pathMatch: 'full' },
      { path: '**', component: WelcomeComponent, pathMatch : 'full'}
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
