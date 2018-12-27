import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MapComponent } from './map/map/map.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { ReportComponent } from './components/report/report.component';
import { NewsComponent } from './components/news/news.component';
import { MapModule } from './map/map.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CoreModule } from './core/core.module';
import { RouteMapperModule } from './route-mapper/route-mapper.module';


@NgModule({
  
  declarations: [
    AppComponent,
    NewsComponent,
    WelcomeComponent,
    ReportComponent,
    TicketsComponent
  ],
  imports: [
    BrowserModule,
    // RouterModule.forRoot([
    //   { path: 'tickets', component: TicketsComponent},
    //   { path: 'editRoutes', component: MapComponent},
    //   { path: 'reports', component: ReportComponent},
    //   { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    //   { path: '**', component: WelcomeComponent, pathMatch : 'full'}
    // ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CoreModule,
    MapModule,
    SharedModule,
    UserModule,
    ScheduleModule,
    RouteMapperModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
