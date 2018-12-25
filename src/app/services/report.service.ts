import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { RestService } from './rest.service';
import { Ticket } from '../model/ticket/ticket';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends RestService<any>  {

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/ticket'], toastr);
  }

  getReport(startDate: Date, endDate: Date){
    return this.http.get<any>(this.url(['reprot/' + startDate + '/' +
      endDate])).pipe(
      catchError(this.handleError<any>())
    );
  }

}