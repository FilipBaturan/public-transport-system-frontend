import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITransportLine } from '../model/ITransportLine';

@Injectable({
  providedIn: 'root'
})
export class TransportLineService {

  transportLineUrl : string = '/transportLine/get/1';
  allTransportLinesUrl : string = '/transportLine/all';

  constructor(private http: HttpClient) { }

  getTransportLines(): Observable<ITransportLine[]>{
    var qwe: Observable<ITransportLine[]>;
    qwe = this.http.get<ITransportLine[]>(this.allTransportLinesUrl);
    return qwe;
  }

  getOneTransportLine(): Observable<ITransportLine>{
    var qwe: Observable<ITransportLine>;
    qwe = this.http.get<ITransportLine>(this.transportLineUrl);
    return qwe;
  }
  
}


