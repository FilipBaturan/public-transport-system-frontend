import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
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
    return this.http.post<Authentication>(this.url(["auth"]), body).pipe(
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

  logout(){
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
    return this.http.get<User[]>(this.url(['unvalidatedUsers'])).pipe(
      catchError(this.handleError<User[]>())
    );
  }

  acceptUser(user: User){
    return this.http.put<User>(this.url(['approveUser']), user).pipe(
      catchError(this.handleError<boolean>())
    );
  }

  denyUser(user: User){
    return this.http.put<User>(this.url(['denyUser']), user).pipe(
      catchError(this.handleError<boolean>())
    );
  }

  getValidators(){
    return this.http.get<User[]>(this.url(['getValidators'])).pipe(
      catchError(this.handleError<User[]>())
    );
  }

  blockValidator(user: User){
    return this.http.put<User>(this.url(['updateValidator']), user).pipe(
      catchError(this.handleError<boolean>())
    );
  }

  addValidator(user: User){
    return this.http.post<User>(this.url(['addValidator']), user).pipe(
      catchError(this.handleError<boolean>())
    );
  }

  addOperator(user: User){
    return this.http.post<User>(this.url(['addOperator']), user).pipe(
      catchError(this.handleError<boolean>())
    );
  }

  getOperators(){
    return this.http.get<User[]>(this.url(['getOperators'])).pipe(
      catchError(this.handleError<User[]>())
    );
  }

  blockOperator(user: User){
    return this.http.put<User>(this.url(['updateOperator']), user).pipe(
      catchError(this.handleError<boolean>())
    );
  }

  getRegUsers(){
    return this.http.get<User[]>(this.url(['registeredUsers'])).pipe(
      catchError(this.handleError<User[]>())
    );
  }

}