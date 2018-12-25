import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { ToastrService } from 'ngx-toastr';
import { Vehicle, VehicleViewer } from '../model/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends RestService<Vehicle> {

  private vehicleURL: string = "/api/vehicle";

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ["/api/vehicle"], toastr);
  }
  
  remove(id: number, index:number, vehicles: Vehicle[], vehicleViewers: VehicleViewer[]): void  {
    this.http.delete(this.vehicleURL + "/" + id, {responseType: "text" as "text"}).
    subscribe((msg) => {
      // remove vehicle from collections
      vehicles.splice(index,1);
      for (let i = 0; i < vehicleViewers.length; i++) {
        const element = vehicleViewers[i];
        if (element.id == id){
          vehicleViewers.splice(i,1);
        }
        }
        this.toastr.success(msg);
      },
      (err) => this.toastr.error("Error happend, can not remove vehicle"));
  }

}
