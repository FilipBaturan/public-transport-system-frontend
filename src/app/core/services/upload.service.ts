import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Image } from 'src/app/model/util.model';

/**
 * Provide REST service for image upload
 *
 * @export
 */
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private url = '/api/image';

  /**
   *Creates an instance of UploadService.
   * @param HttpClient http HTTP REST service
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Gets image
   *
   * @param string imagePath path to image resource
   * @returns image content
   */
  getImage(imagePath: string): Observable<Image> {
    return this.http.get<Image>('api/image/' + imagePath).pipe(catchError(this.handleException));
  }

  /**
   * Uploads image
   *
   * @param FormData uploadData image data
   */
  uploadImage(uploadData: FormData) {
    return this.http.post(this.url, uploadData, { responseType: 'text' })
      .pipe(catchError(this.handleException));
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
