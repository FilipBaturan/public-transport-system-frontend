import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { ToastrService } from 'ngx-toastr';
import { Vehicle } from '../model/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends RestService<Vehicle> {

  private vehicleURL: string = "/api/vehicle";

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ["/api/vehicle"], toastr);
  }
  
  remove(id: number, index:number, vehicles: Vehicle[]): void  {
    this.http.delete(this.vehicleURL + "/" + id, {responseType: "text" as "text"}).
    subscribe( msg => {
      // remove vehicle from collection
      vehicles.splice(index,1);
        this.toastr.success(msg);
      }, err => this.toastr.error("Error happend, can not remove vehicle"));
  }

}
