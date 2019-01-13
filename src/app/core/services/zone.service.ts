import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { Zone } from 'src/app/model/zone.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Provide REST service for vehicle
 *
 * @export
 * @class ZoneService
 * @extends {RestService<Zone>}
 */
@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private url: string = "/api/zone";

  /**
   * Creates an instance of ZoneService.
   * @param {HttpClient} http HTTP REST service
   * @param {ToastrService} toastrService user notification service
   * @memberof ZoneService
   */
  constructor(private http: HttpClient, private toastrService: ToastrService) {
  }

  /**
   * Gets all available zones
   *
   * @returns {Observable<Zone[]>} available zones
   * @memberof ZoneService
   */
  findAll(): Observable<Zone[]> {
    return this.http.get<Zone[]>(this.url).pipe(catchError(this.handleException));
  }

  /**
   * Creates/Updates zone
   *
   * @param {Zone} zone zone that needs to be crated/updated
   * @returns {Observable<Zone>} created/updated zone
   * @memberof ZoneService
   */
  create(zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(this.url, zone).pipe(catchError(this.handleException));
  }

  /**
   * Remove target zone
   *
   * @param {number} id target zone id
   * @param {Zone[]} zones all available zones
   * @memberof ZoneService
   */
  remove(id: number, zones: Zone[]): void {
    this.http.delete(this.url + "/" + id, { responseType: "text" as "text" }).
      subscribe(() => {
        let temp: Zone[];
        this.findAll().subscribe(result => {
          temp = result;
          for (let index = 0; index < temp.length; index++) {
            const zone = temp[index];
            zones[index] = zone;
          }
          zones.length = temp.length;
          this.toastrService.success("Zone successfuly deleted!");
        });
      }, err =>
      err.status == 403 ? this.toastrService.error("Forbidden!") : this.toastrService.error(err.error));
  }

  /**
   * Handles errors occured by REST service
   *
   * @private
   * @param {HttpErrorResponse} err HTTP reponse error
   * @returns {Observable<never>} observable
   * @memberof TransportLineService
   */
  private handleException(err: HttpErrorResponse): Observable<never> {
    if (err.error) {
      if (err.error.message) {
        return throwError(err.error.message);
      } else if ((typeof err.error === 'string')
        && !err.error.startsWith("Error occured")) {
        return throwError(err.error);
      } else {
        return throwError('Server is down!');
      }
    } else {
      return throwError('Client side error!');
    }
  }
}
