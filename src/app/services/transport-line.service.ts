import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TransportLine } from '../model/transport-line.model';

import { RestService } from './rest.service';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TransportLineService extends RestService<TransportLine>  {

  //transportLineUrl : string = 'transportLine/get/1';
  //allTransportLinesUrl : string = 'transportLine/all';

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/transportLine'], toastr);
  }

  /*getTransportLines(): Observable<TransportLine[]>{
    var qwe: Observable<TransportLine[]>;
    qwe = this.http.get<TransportLine[]>(this.allTransportLinesUrl);
    return qwe;
  }

  getOneTransportLine(): Observable<TransportLine>{
    var qwe: Observable<TransportLine>;
    qwe = this.http.get<TransportLine>(this.transportLineUrl);
    return qwe;
  }*/
  
}


