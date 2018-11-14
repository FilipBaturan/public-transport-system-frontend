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
      { path: '**', component: WelcomeComponent, pathMatch : 'full'}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
