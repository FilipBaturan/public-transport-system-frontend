import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { RestService } from './rest.service';
import { Ticket } from 'src/app/model/ticket/ticket';
import { throwError, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class TicketService extends RestService<Ticket> {

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/ticket'], toastr);
  }

  getTicketsForUser(userId: number){
    return this.http.get<any>(this.url(['getTicketsForUser/' +  userId])).pipe(
      catchError(this.handleException)
    );
  }

  denyTicket(t: Ticket){
    return this.http.put<any>(this.url(['updateTicket']), t).pipe(
      catchError(this.handleException)
    );
  }

  private handleException(err: HttpErrorResponse): Observable<never> {
    if (err.error) {
      if (err.error.message) {
        return throwError(err.error.message);
      } else if ((typeof err.error === 'string')
        && !err.error.startsWith("Error occured")) {
        return throwError(err.error);
      } else {
        return throwError('Server is down!');
      }
    } else {
      return throwError('Client side error!');
    }
  }

}
