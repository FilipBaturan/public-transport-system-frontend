import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Station, StationCollection } from 'src/app/model/station.model';

/**
 * Provide REST service for station
 *
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class StationService {

  private url = '/api/station';

  /**
   * Creates an instance of StationService.
   * @param HttpClient http HTTP REST service
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Gets all available stations
   *
   * @returns all available stations
   */
  findAll(): Observable<Station[]> {
    return this.http.get<Station[]>(this.url).pipe(catchError(this.handleException));
  }

  /**
   * Replaces all old stations with new ones
   *
   * @param StationCollection stations new or updated stations
   * @returns station collection observable
   */
  replaceStations(stations: StationCollection): Observable<Station[]> {
    return this.http.post<Station[]>(this.url + '/replace', stations).pipe(
       catchError(this.handleException)
    );
  }

  /**
   * Handles errors occured by REST service
   *
   * @param HttpErrorResponse err HTTP reponse error
   * @returns observable
   */
  private handleException(err: HttpErrorResponse): Observable<never> {
    if (err.error) {
      if (err.error.message) {
        return throwError(err.error.message);
      } else if ((typeof err.error === 'string')
        && !err.error.startsWith('Error occured')) {
        return throwError(err.error);
      } else {
        return throwError('Server is down!');
      }
    } else {
      return throwError('Client side error!');
    }
  }

}
