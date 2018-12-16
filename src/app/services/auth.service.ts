import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';
import { Authentication } from '../model/authentication.model';
import { tap, catchError } from 'rxjs/operators';
import { RestService } from './rest.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TokenUtilsService } from '../util/token-utils.service';

const userToken = "userToken";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RestService<User> {

  constructor(http: HttpClient, toastr: ToastrService, private tokenUtils: TokenUtilsService) {
    super(http, ['/api/user/auth'], toastr);
  }

  authenticate(body: User): Observable<Authentication> {
    return this.http.post<Authentication>(this.url(), body).pipe(
      tap(res => {
        console.log(res);
        localStorage.setItem(userToken, JSON.stringify({
          user: res.user,
          roles: this.tokenUtils.getRoles(res.token),
          token: res.token
        }));
      }),
      catchError(this.handleError<Authentication>())
    );
  }

  signout(): void {
    localStorage.removeItem(userToken);
  }

  usernameTaken(username: string): Observable<boolean> {
    return this.http.get<boolean>(this.url(), { params: { 'username': username } }).pipe(
      catchError(this.handleError<boolean>())
    );
  }

  getCurrentUser() {
    return this.http.get<User>(this.url(['currentUser'])).pipe(
      catchError(this.handleError<User>())
    );
  }

  getAuthenticatedUser() {
    return JSON.parse(localStorage.getItem(userToken));
  }

  getAuthenticatedUserId() {
    return this.getAuthenticatedUser().user.id;
  }

  getToken(): String {
    const authenticatedUser = this.getAuthenticatedUser();
    const token = authenticatedUser && authenticatedUser.token;
    return token ? token : '';
  }
}
