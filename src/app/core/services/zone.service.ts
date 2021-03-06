import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Zone } from 'src/app/model/zone.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Provide REST service for vehicle
 *
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private url = '/api/zone';

  /**
   * Creates an instance of ZoneService.
   * @param HttpClient http HTTP REST service
   * @param ToastrService toastrService user notification service
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Gets all available zones
   *
   * @returns available zones
   */
  findAll(): Observable<Zone[]> {
    return this.http.get<Zone[]>(this.url).pipe(catchError(this.handleException));
  }

  /**
   * Creates/Updates zone
   *
   * @param Zone zone zone that needs to be crated/updated
   * @returns created/updated zone
   */
  create(zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(this.url, zone).pipe(catchError(this.handleException));
  }

  /**
   * Remove target zone
   *
   * @param number id target zone id
   * @param Zone[] zones all available zones
   */
  remove(id: number): Observable<{}> {
    return this.http.delete(this.url + '/' + id, { responseType: 'text' as 'text' });
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
