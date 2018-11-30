import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TransportLineComponent } from './components/transport-line/transport-line.component';
import { TransportLineListComponent } from './components/transport-line-list/transport-line-list.component';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatMenuModule,  MatIconModule} from '@angular/material';
import {MatTooltipModule, MatToolbarModule, MatCardModule, MatSidenavModule, MatFormFieldModule,
  MatInputModule, MatListModule} from '@angular/material';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AuthComponent } from './components/auth/auth.component';
import { MapComponent } from './components/map/map.component';
import { ToastrModule } from 'ngx-toastr';
import { UnconfirmedUserListComponent } from './components/unconfirmed-user-list/unconfirmed-user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ValidatorListComponent } from './components/validator-list/validator-list.component';

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
    ValidatorListComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatToolbarModule,
    MatListModule,
    RouterModule.forRoot([

      { path: 'transportLineList', component: TransportLineListComponent},
      { path: 'transportLine', component: TransportLineComponent},
      { path: 'unconfirmedUsers', component: UnconfirmedUserListComponent},
      { path: 'userProfile', component: UserProfileComponent},
      { path: 'validators', component: ValidatorListComponent},
      { path: 'editRoutes', component: MapComponent},
      { path: '**', component: WelcomeComponent, pathMatch : 'full'}
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
