import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { ToastrService } from 'ngx-toastr';
import { Vehicle } from 'src/app/model/vehicle.model';


/**
 * Provide REST service for vehicle
 *
 * @export
 * @class VehicleService
 * @extends {RestService<Vehicle>} REST service template
 */
@Injectable({
  providedIn: 'root'
})
export class VehicleService extends RestService<Vehicle> {

  /**
   * Creates an instance of VehicleService.
   * @param {HttpClient} http HTTP REST service
   * @param {ToastrService} toastrService user notification service
   * @memberof VehicleService
   */
  constructor(http: HttpClient, toastrService: ToastrService) {
    super(http, ["/api/vehicle"], toastrService);
  }

  /**
   * Remove target vehicle
   *
   * @param {number} id target vehicle id
   * @param {number} index index in vehicle collection
   * @param {Vehicle[]} vehicles
   * @memberof VehicleService
   */
  remove(id: number, index: number, vehicles: Vehicle[]): void {
    this.http.delete(this.url() + "/" + id, { responseType: "text" as "text" }).
      subscribe(msg => {
        // remove vehicle from collection
        vehicles.splice(index, 1);
        this.toastr.success(msg);
      }, err => this.toastr.error(err.error));
  }
}
