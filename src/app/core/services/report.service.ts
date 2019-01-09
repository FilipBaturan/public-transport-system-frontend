import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { RestService } from './rest.service';
import { Observable, throwError } from 'rxjs';

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
      catchError(this.handleException)
    );
  }

  getVisitsPerWeek(startDate: string, endDate: string){
    return this.http.get<any>(this.url(['getVisitsPerWeek/' + startDate + '/' +
      endDate])).pipe(
      catchError(this.handleException)
    );
  }

  getVisitsPerMonth(startDate: string, endDate: string){
    return this.http.get<any>(this.url(['getVisitsPerMonth/' + startDate + '/' +
      endDate])).pipe(
      catchError(this.handleException)
    );
  }

  private handleException(response: HttpErrorResponse): Observable<never> {
    if (response.error) {
      if (response.error.message) {
        return throwError(response.error.message);
      } else if ((typeof response.error === 'string')
        && !response.error.startsWith("Error occured")) {
        return throwError(response.error);
      } else {
        return throwError('Server is down!');
      }
    } else {
      return throwError('Client side error!');
    }
  }

}
