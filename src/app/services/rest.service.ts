import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Page } from '../model/page/page.model';
import { PagedData } from '../model/page/paged-data.model';

/**
 * Generic REST service to be inherited by all other HTTP services.
 */
export abstract class RestService<T> {

  constructor(protected http: HttpClient,
    protected queryParts: string[], // E.g. ['/api/buildings', 'malfunctions']
    private toastr: ToastrService) { }

  findAll(...queryParams: any[]): Observable<T[]> {
    return this.http.get<T[]>(this.url(queryParams)).pipe(
      catchError(this.handleError<T[]>())
    );
  }

  findAllPagable(page: Page, ...queryParams: any[]): Observable<PagedData<T>> {
    return this.http.get<PagedData<T>>(
      this.url(queryParams), { params: { 'page': String(page.pageNumber), 'size': String(page.size) } }
    ).pipe(
      catchError(this.handleError<PagedData<T>>())
      );
  }

  findById(...queryParams: any[]): Observable<T> {
    return this.http.get<T>(this.url(queryParams)).pipe(
      catchError(this.handleError<T>())
    );
  }

  create<D>(body: T | D, ...queryParams: any[]): Observable<number> {
    return this.http.post<number>(this.url(queryParams), body).pipe(
      catchError(this.handleError<number>())
    );
  }

  update<D>(body: T | D, ...queryParams: any[]): Observable<T> {
    return this.http.put<T>(this.url(queryParams), body).pipe(
      catchError(this.handleError<T>())
    );
  }

  delete(...queryParams: any[]): Observable<void> {
    return this.http.delete<void>(this.url(queryParams)).pipe(
      catchError(this.handleError<void>())
    );
  }

  /**
   * Concatenates elements of queryParts and queryParams in alternative order
   * in order to construct an API URL. For example, the arrays
   * queryParts = ['/api/buildings', 'malfunctions'] and queryParams = [2, 10]
   * would result in '/api/buildings/2/malfunctions/10'.
   * @param queryParams URL query parameters
   */
  protected url(queryParams: any[] = []): string {
    let url = '';
    const paramsLength = queryParams.length;
    const partsLength = this.queryParts.length;

    for (let i = 0; i < partsLength; i++) {
      url += this.queryParts[i] + '/';
      if (i < paramsLength) {
        url += queryParams[i] + '/';
      }
    }

    if (paramsLength > partsLength) {
      for (let i = partsLength; i < paramsLength; i++) {
        url += queryParams[i] + '/';
      }
    }

    return url;
  }

  protected handleError<E>(operation = 'operation', result?: E) {
    return (response: any): Observable<E> => {
      console.error(response);
      // Get error object from response and its error message
      if (response.error) {
        if (response.error.error) {
          this.toastr.error(response.error.error);
        } else {
          this.toastr.error('Server is down!');
        }
      } else {
        this.toastr.error('Client side error!');
      }
      return Observable.throw(result as E);
    };
  }
}
