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
export class NewsService extends RestService<News>{

  constructor(http: HttpClient, toastr: ToastrService, private tokenUtils: TokenUtilsService) {
    super(http, ['/api/news'], toastr); }

    saveNews(news: NewsToAdd): Observable<NewsToAdd>{
      return this.http.post<NewsToAdd>(this.url(), news).pipe(
        catchError(this.handleError<any>())
      );
    }

}
