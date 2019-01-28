import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '../core/services/user.service';
import { Observable } from 'rxjs';

@Injectable()
export class IsValidatorGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userService.isAuthenticated() && this.userService.isValidator()) {
      return true;
    }

    this.router.navigateByUrl('welcome');
    return false;
  }
}
