import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Image } from 'src/app/model/image.mode';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private url = "/api/image";

  constructor(private http: HttpClient) {
  }

  getImage(imagePath: string): Observable<Image> {
    return this.http.get<Image>("api/image/" + imagePath).pipe(catchError(this.handleException))
  }

  uploadImage(uploadData: FormData) {
    return this.http.post(this.url, uploadData, { responseType: "text" })
      .pipe(catchError(this.handleException));
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
