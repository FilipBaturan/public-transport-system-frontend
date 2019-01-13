import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptorService } from './services/token-interceptor.service';

import { TokenUtilsService } from './util/token-utils.service';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule
  ],
  declarations: [],
  providers: [
    TokenUtilsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule { }
