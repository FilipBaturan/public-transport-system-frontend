import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RestService } from './rest.service';
import { Ticket } from '../model/ticket/ticket';


@Injectable({
  providedIn: 'root'
})
export class TicketService extends RestService<Ticket> {

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/ticket'], toastr);
  }

  getTicketsForUser(userId: number){
    return this.http.get<Ticket[]>(this.url(['getTicketsForUser/' +  userId])).pipe(
      catchError(this.handleError<Ticket[]>())
    );
  }

  denyTicket(t: Ticket){
    return this.http.put<boolean>(this.url(['updateTicket']), t).pipe(
      catchError(this.handleError<boolean>())
    );
  }

}
