import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { RestService } from './rest.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Station, StationCollection } from 'src/app/model/station.model';

/**
 * Provide REST service for station
 *
 * @export
 * @class StationService
 * @extends {RestService<Station>} REST service template
 */
@Injectable({
  providedIn: 'root'
})
export class StationService extends RestService<Station> {

  /**
   * Creates an instance of StationService.
   * @param {HttpClient} http HTTP REST service
   * @param {ToastrService} toastrService user notification service
   * @memberof StationService
   */
  constructor(http: HttpClient, toastrService: ToastrService) {
    super(http, ["/api/station"], toastrService);
  }

  /**
   * Replaces all old stations with new ones
   *
   * @param {StationCollection} stations new or updated stations
   * @returns {Observable<Station[]>} station collection observable
   * @memberof StationService
   */
  replaceStations(stations: StationCollection): Observable<Station[]> {
    return this.http.post<Station[]>(this.url() + "/replace", stations).pipe(
       catchError(this.handleException)
    );
  }

  /**
   * Handles errors occured by REST service
   *
   * @private
   * @param {HttpErrorResponse} err HTTP reponse error
   * @returns {Observable<never>} observable
   * @memberof StationService
   */
  private handleException(err: HttpErrorResponse): Observable<never> {
    return throwError(err.message);
  }

}
