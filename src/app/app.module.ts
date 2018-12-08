import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {MatButtonModule, MatCheckboxModule, MatCardModule, MatProgressSpinnerModule, MatMenuModule,
     MatIconModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule} from '@angular/material';

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
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { RegUserListComponent } from './components/reg-user-list/reg-user-list.component';
import { UserTicketsComponent } from './components/user-tickets/user-tickets.component';
import { ReportComponent } from './components/report/report.component';

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
    RegUserListComponent,
    UserTicketsComponent,
    ReportComponent,
    
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    NgxDatatableModule,
    MatCheckboxModule,
    MatCardModule,
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
    RouterModule.forRoot([
      { path: 'userTickets/:id', component: UserTicketsComponent},
      { path: 'signup', component: SignupComponent},
      { path: 'schedule', component: ScheduleComponent},
      { path: 'transportLineList', component: TransportLineListComponent},
      { path: 'transportLine', component: TransportLineComponent},
      { path: 'unconfirmedUsers', component: UnconfirmedUserListComponent},
      { path: 'userProfile', component: UserProfileComponent},
      { path: 'validators', component: ValidatorListComponent},
      { path: 'registeredUsers', component: RegUserListComponent},
      { path: 'editRoutes', component: MapComponent},
      { path: 'reports', component: ReportComponent},
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
