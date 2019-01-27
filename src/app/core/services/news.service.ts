import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { News, NewsToAdd } from 'src/app/model/news.model';
import { TokenUtilsService } from '../util/token-utils.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NewsService extends RestService<News> {

  private _url: string;

  constructor(http: HttpClient, toastr: ToastrService, private tokenUtils: TokenUtilsService) {
    super(http, ['/api/news'], toastr);
    this._url = '/api/news';
  }

    saveNews(news: NewsToAdd): Observable<NewsToAdd> {
      return this.http.post<NewsToAdd>(this.url(), news).pipe(
        catchError(this.handleError<any>())
      );
    }

    remove(id: number): Observable<{}> {
      return this.http.delete(this._url + '/' + id, { responseType: 'text' as 'text' });
    }

}
