import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RestService } from './rest.service';
import { User } from 'src/app/model/users/user.model';
import { Authentication } from 'src/app/model/authentication.model';
import { LogIn } from 'src/app/model/login.model';
import { TokenUtilsService } from '../util/token-utils.service';


const authenticatedUser = 'authenticatedUser';

@Injectable({
  providedIn: 'root'
})
export class UserService extends RestService<User> {

  constructor(http: HttpClient, toastr: ToastrService, private tokenUtils: TokenUtilsService) {
    super(http, ['/api/user'], toastr);
  }

  authenticate(body: User): Observable<Authentication> {
    return this.http.post<Authentication>(this.url(['auth']), body).pipe(
      tap(res => {
        localStorage.setItem(authenticatedUser, JSON.stringify({
          user: res.user,
          roles: this.tokenUtils.getRoles(res.token),
          token: res.token
        }));
        console.log(localStorage);
      }),
      catchError(this.handleError<Authentication>())
    );
  }

  login(user: LogIn): Observable<any> {
    return this.http.post<any>(this.url(['auth']), user);
  }

  logout() {
    localStorage.removeItem(authenticatedUser);
  }

  signout(): void {
    localStorage.removeItem(authenticatedUser);
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
    return JSON.parse(localStorage.getItem(authenticatedUser));
  }

  getAuthenticatedUserId() {
    return this.getAuthenticatedUser().user.id;
  }

  getToken(): String {
    const authenticatedUser = this.getAuthenticatedUser();
    const token = authenticatedUser && authenticatedUser.token;
    return token ? token : '';
  }

  isAuthenticated(): boolean {
    return this.getToken() !== '';
  }

  isAdmin(): boolean {
    const authenticatedUser = this.getAuthenticatedUser();
    return authenticatedUser
      && authenticatedUser.roles
      && authenticatedUser.roles.indexOf('ADMIN') > -1;
  }

  isOperater(): boolean {
    const authenticatedUser = this.getAuthenticatedUser();
    return authenticatedUser
      && authenticatedUser.roles
      && authenticatedUser.roles.indexOf('OPERATER') > -1;
  }

  isValidator(): boolean {
    const authenticatedUser = this.getAuthenticatedUser();
    return authenticatedUser
      && authenticatedUser.roles
      && authenticatedUser.roles.indexOf('VALIDATOR') > -1;
  }

  getUnconfirmedUsers() {
    console.log(this.url(['unvalidatedUsers']));
    return this.http.get<any>(this.url(['unvalidatedUsers'])).pipe(
      catchError(this.handleException)
    );
  }

  acceptUser(user: User) {
    return this.http.put<any>(this.url(['approveUser']), user);
  }

  denyUser(user: User) {
    return this.http.put<any>(this.url(['denyUser']), user);
  }

  getValidators() {
    return this.http.get<any>(this.url(['getValidators'])).pipe(
      catchError(this.handleException)
    );
  }

  updateValidator(user: User) {
    return this.http.put<any>(this.url(['updateValidator']), user);
  }

  addValidator(user: User) {
    return this.http.post<any>(this.url(['addValidator']), user);
  }

  addOperator(user: User) {
    return this.http.post<User>(this.url(['addOperator']), user).pipe(
      catchError(this.handleError<boolean>())
    );
  }

  getOperators() {
    return this.http.get<User[]>(this.url(['getOperators'])).pipe(
      catchError(this.handleError<User[]>())
    );
  }

  updateOperator(user: User) {
    return this.http.put<User>(this.url(['updateOperator']), user).pipe(
      catchError(this.handleError<boolean>())
    );
  }

  getRegUsers() {
    return this.http.get<any>(this.url(['registeredUsers'])).pipe(
      catchError(this.handleException)
    );
  }

  getByUsername(username: String) {
    return this.http.get<any>(this.url(['getByUsername/' + username])).pipe(
      catchError(this.handleException)
    );
  }

  private handleException(response: HttpErrorResponse): Observable<never> {
    if (response.error) {
      if (response.error.message) {
        return throwError(response.error.message);
      } else if ((typeof response.error === 'string')
        && !response.error.startsWith('Error occured')) {
        return throwError(response.error);
      } else {
        return throwError('Server is down!');
      }
    } else {
      return throwError('Client side error!');
    }
  }

}
