import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private inj: Injector) { console.log('usao u konstruktor'); }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('usao u token interceptor');
    const authService: UserService = this.inj.get(UserService);
    console.log('token: ' + authService.getToken());
    request = request.clone({
      setHeaders: {
        'X-Auth-Token': `${authService.getToken()}`
      }
    });

    return next.handle(request);
  }
}
