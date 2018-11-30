import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Station } from '../model/station.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class StationService extends RestService<Station> {

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/station'], toastr);
  }
}
