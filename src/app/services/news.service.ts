import { Injectable } from '@angular/core';
import { News } from "../model/news.model"
import { RestService } from './rest.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TokenUtilsService } from '../util/token-utils.service';


@Injectable({
  providedIn: 'root'
})
export class NewsService extends RestService<News>{

  constructor(http: HttpClient, toastr: ToastrService, private tokenUtils: TokenUtilsService) {
    super(http, ['/api/news'], toastr); }
}
