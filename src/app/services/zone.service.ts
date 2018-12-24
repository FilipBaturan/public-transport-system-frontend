import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Zone } from '../model/zone.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ZoneService extends RestService<Zone>{

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/zone'], toastr);
  }
}
