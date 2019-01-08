import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { ReportComponent } from './components/report/report.component';
import { NewsComponent } from './components/news/news.component';
import { NewsAdministrationComponent } from './components/news-administration/news-administration.component';
import { MapModule } from './map/map.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from './schedule/schedule.module';


@NgModule({
  
  declarations: [
    AppComponent,
    NewsComponent,
    NewsAdministrationComponent,
    WelcomeComponent,
    ReportComponent,
    TicketsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MapModule,
    RouterModule.forRoot([
      { path: 'tickets', component: TicketsComponent},
      { path: 'editRoutes', component: MapComponent},
      { path: 'reports', component: ReportComponent},
      { path: 'newsAdministration', component: NewsAdministrationComponent},
      { path: '', redirectTo: '/welcome', pathMatch: 'full' },
      { path: '**', component: WelcomeComponent, pathMatch : 'full'}
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SharedModule,
    UserModule,
    ScheduleModule,
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
