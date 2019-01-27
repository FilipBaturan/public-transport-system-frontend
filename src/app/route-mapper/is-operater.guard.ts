import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { UserService } from '../core/services/user.service';
import { Observable } from 'rxjs';

@Injectable()
export class IsOperaterGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userService.isAuthenticated() && this.userService.isOperater()) {
      return true;
    }

    this.router.navigateByUrl('welcome');
    return false;
  }
}
