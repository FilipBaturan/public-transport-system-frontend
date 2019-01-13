import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TicketsComponent } from '../components/tickets/tickets.component';
import { MapComponent } from '../map/map/map.component';
import { ReportComponent } from '../components/report/report.component';
import { WelcomeComponent } from '../components/welcome/welcome.component';
import { VehicleComponent } from '../map/vehicle/vehicle.component';
import { ZoneComponent } from '../map/zone/zone.component';
import { ScheduleComponent } from '../schedule/schedule/schedule.component';
import { UserTicketsComponent } from '../user/user-tickets/user-tickets.component';
import { AuthComponent } from '../user/auth/auth.component';
import { SignupComponent } from '../user/signup/signup.component';
import { UnconfirmedUserListComponent } from '../user/unconfirmed-user-list/unconfirmed-user-list.component';
import { UserProfileComponent } from '../user/user-profile/user-profile.component';
import { ValidatorListComponent } from '../user/validator-list/validator-list.component';
import { RegUserListComponent } from '../user/reg-user-list/reg-user-list.component';
import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { IsOperaterGuard } from './is-operater.guard';
import { IsValidatorGuard } from './is-validator.guard';
import { NewsAdministrationComponent } from '../components/news-administration/news-administration.component';

@NgModule({
  declarations: [],
  providers: [
    IsAuthenticatedGuard,
    IsOperaterGuard,
    IsValidatorGuard
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot([
      { path: 'tickets', component: TicketsComponent, canActivate: [IsAuthenticatedGuard]},
      { path: 'map', component: MapComponent},
      { path: 'newsAdministration', component: NewsAdministrationComponent },
      { path: 'reports', component: ReportComponent, canActivate: [IsAuthenticatedGuard]},
      { path: 'vehicles', component: VehicleComponent, canActivate: [IsOperaterGuard]},
      { path: 'zones', component: ZoneComponent, canActivate: [IsOperaterGuard]},
      { path: 'schedule', component: ScheduleComponent},
      { path: 'userTickets/:id', component: UserTicketsComponent, canActivate: [IsAuthenticatedGuard]},
      { path: 'signin', component: AuthComponent},
      { path: 'signup', component: SignupComponent},
      { path: 'unconfirmedUsers', component: UnconfirmedUserListComponent, canActivate: [IsValidatorGuard]},
      { path: 'userProfile', component: UserProfileComponent, canActivate: [IsAuthenticatedGuard]},
      { path: 'validators', component: ValidatorListComponent, canActivate: [IsAuthenticatedGuard]},
      { path: 'registeredUsers', component: RegUserListComponent, canActivate: [IsAuthenticatedGuard]},
      { path: '', redirectTo: '/welcome', pathMatch: 'full' },
      { path: '**', component: WelcomeComponent, pathMatch : 'full'}
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class RouteMapperModule { }
