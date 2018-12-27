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
export class TransportLineService extends RestService<TransportLine>  {

  /**
   * Creates an instance of TransportLineService.
   * @param {HttpClient} http HTTP REST service
   * @param {ToastrService} toastrService user notification service
   * @memberof TransportLineService
   */
  constructor(http: HttpClient, toastrService: ToastrService) {
    super(http, ["/api/transportLine"], toastrService);
  }

  /**
   * Replaces all old transport lines with new ones
   *
   * @param {TransportLineCollection} transportLines new or updated transport lines
   * @returns {Observable<TransportLine[]>} transport line collection observable
   * @memberof TransportLineService
   */
  replaceTransportLines(transportLines: TransportLineCollection): Observable<TransportLine[]> {
    return this.http.post<TransportLine[]>(this.url() + "/replace", transportLines).pipe(
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
    return throwError(err.message || "Server error");
  }
}


