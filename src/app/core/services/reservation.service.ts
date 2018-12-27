import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Reservation } from 'src/app/model/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends RestService<Reservation>{

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/reservation'], toastr);
   }
}
