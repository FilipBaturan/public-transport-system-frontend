import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Pricelist } from 'src/app/model/pricelist.model';

@Injectable({
  providedIn: 'root'
})
export class PricelistService extends RestService<Pricelist> {

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/pricelist'], toastr);
  }

  getActivePricelist() {
    return this.http.get<Pricelist>(this.url(['findActive'])).pipe(
      catchError(this.handleError<any>())
    );
  }

}
