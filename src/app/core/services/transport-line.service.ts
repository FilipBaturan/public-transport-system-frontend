import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RestService } from './rest.service';
import { ToastrService } from 'ngx-toastr';
import { TransportLine, TransportLineCollection } from 'src/app/model/transport-line.model';

/**
 * Provide REST service for transport lines
 *
 * @export
 * @class TransportLineService
 * @extends {RestService<TransportLine>} REST service template
 */
@Injectable({
  providedIn: 'root'
})
export class TransportLineService {

  private url: string = "/api/transportLine";

  /**
   * Creates an instance of TransportLineService.
   * @param {HttpClient} http HTTP REST service
   * @param {ToastrService} toastrService user notification service
   * @memberof TransportLineService
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Gets all available transport lines
   *
   * @returns {Observable<TransportLine[]>} all available transport lines
   * @memberof TransportLineService
   */
  findAll(): Observable<TransportLine[]> {
    return this.http.get<TransportLine[]>(this.url).pipe(catchError(this.handleException));
  }

  /**
   * Creates/Updates transport line
   *
   * @param {TransportLine} transportLine transport line that needs to be crated/updated
   * @returns {Observable<TransportLine>} created/updated transport line
   * @memberof TransportLineService
   */
  create(transportLine: TransportLine): Observable<TransportLine> {
    return this.http.post<TransportLine>(this.url, transportLine).pipe(catchError(this.handleException));
  }

  /**
   * Replaces all old transport lines with new ones
   *
   * @param {TransportLineCollection} transportLines new or updated transport lines
   * @returns {Observable<TransportLine[]>} transport line collection observable
   * @memberof TransportLineService
   */
  replaceTransportLines(transportLines: TransportLineCollection): Observable<TransportLine[]> {
    return this.http.post<TransportLine[]>(this.url + "/replace", transportLines).pipe(
      catchError(this.handleException)
    );
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


