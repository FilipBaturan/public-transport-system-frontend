import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private inj: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService: UserService = this.inj.get(UserService);
    request = request.clone({
      setHeaders: {
        'X-Auth-Token': `${authService.getToken()}`
      }
    });

    return next.handle(request);
  }
}
