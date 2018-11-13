import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TransportLineComponent } from './components/transport-line/transport-line.component';
import { TransportLineListComponent } from './components/transport-line-list/transport-line-list.component';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  
  declarations: [
    AppComponent,
    TransportLineComponent,
    TransportLineComponent,
    TransportLineListComponent,
    WelcomeComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([

      { path: 'transportLineList', component: TransportLineListComponent},
      { path: 'transportLine', component: TransportLineComponent},
      { path: '**', component: WelcomeComponent, pathMatch : 'full'}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
