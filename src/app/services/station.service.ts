import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Station, StationCollection } from '../model/station.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StationService extends RestService<Station> {

  private stationURL: string = "/api/station"

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ["/api/station"], toastr);
  }

  replaceStations(stations: StationCollection): Observable<Station[]> {
    return this.http.post<Station[]>(this.stationURL + "/replace", stations).pipe(
       catchError(this.handleException)
    );
  }

  private handleException(err: HttpErrorResponse) {
    return throwError(err.message);
  }

}
