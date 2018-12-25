import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TransportLine } from '../model/transport-line.model';
import { RestService } from './rest.service';
import { ToastrService } from 'ngx-toastr';
import { TransportLineCollection } from '../model/transport-line.model';

@Injectable({
  providedIn: 'root'
})
export class TransportLineService extends RestService<TransportLine>  {

  private transportLineURL: string = "/api/transportLine";

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ["/api/transportLine"], toastr);
  }
  
  replaceTransportLines(transportLines: TransportLineCollection): Observable<TransportLine[]> {
    return this.http.post<TransportLine[]>(this.transportLineURL + "/replace", transportLines).pipe(
       catchError(this.handleException)
    );
  }

  private handleException(err: HttpErrorResponse) {
    return throwError(err.message || "Server error");
  }

}


