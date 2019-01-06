import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends RestService<any>  {

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/ticket'], toastr);
  }

  getReport(startDate: string, endDate: string){
    return this.http.get<any>(this.url(['reprot/' + startDate + '/' +
      endDate])).pipe(
      catchError(this.handleError<any>())
    );
  }

  getVisitsPerWeek(startDate: string, endDate: string){
    return this.http.get<any>(this.url(['getVisitsPerWeek/' + startDate + '/' +
      endDate])).pipe(
      catchError(this.handleError<any>())
    );
  }

  getVisitsPerMonth(startDate: string, endDate: string){
    return this.http.get<any>(this.url(['getVisitsPerMonth/' + startDate + '/' +
      endDate])).pipe(
      catchError(this.handleError<any>())
    );
  }

}