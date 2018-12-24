import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { Reservation } from '../model/reservation.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends RestService<Reservation>{

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/reservation'], toastr);
   }
}
