import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '../core/services/user.service';
import { Observable } from 'rxjs';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userService.isAuthenticated()) {
      return true;
    }

    this.router.navigateByUrl('signin');
    return false;
  }
}
