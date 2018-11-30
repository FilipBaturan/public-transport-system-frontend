import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TransportLine } from '../model/transportLine.model';
import { RestService } from './rest.service';
import { ToastrService } from 'ngx-toastr';
import { TransportLineCollection } from '../model/transportRoute.model';

@Injectable({
  providedIn: 'root'
})
export class TransportLineService extends RestService<TransportLine>  {

  private transportLineURL = "/api/transportLine";

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/transportLine'], toastr);
  }
  
  replacetransportLines(transportLines: TransportLineCollection): Observable<TransportLine[]> {
    return this.http.post<TransportLine[]>(this.transportLineURL + "/replace", transportLines).pipe(
      tap(data => console.log("All stations: " + JSON.stringify(data))),
       catchError(this.handleException)
    );
  }

  private handleException(err: HttpErrorResponse) {
    this.toastr.error(`Status: ${err.status}, message: ${err.message}`);
    return throwError(err.message);
  }

}


