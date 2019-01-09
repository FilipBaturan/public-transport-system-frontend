import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { Vehicle, VehicleSaver } from 'src/app/model/vehicle.model';


/**
 * Provide REST service for vehicle
 *
 * @export
 * @class VehicleService
 */
@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private url: string;

  /**
   * Creates an instance of VehicleService.
   * @param {HttpClient} http HTTP REST service
   * @param {ToastrService} toastrService user notification service
   * @memberof VehicleService
   */
  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.url = "/api/vehicle";
  }

  /**
   * Gets all available vehicles 
   *
   * @returns {Observable<Vehicle[]>} all available vehicles
   * @memberof VehicleService
   */
  findAll(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.url).pipe(catchError(this.handleException));
  }

  /**
   * Creates/Updates vehicle
   *
   * @param {VehicleSaver} vehicle vehicle that needs to be crated/updated
   * @returns {Observable<Vehicle>} created/updated vehicle
   * @memberof VehicleService
   */
  create(vehicle: VehicleSaver): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.url, vehicle).pipe(catchError(this.handleException));
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
    this.http.delete(this.url + "/" + id, { responseType: "text" as "text" }).
      subscribe(msg => {
        // remove vehicle from collection
        vehicles.splice(index, 1);
        this.toastrService.success(msg);
      }, err =>
          err.status == 403 ? this.toastrService.error("Forbidden!") : this.toastrService.error(err.error));
  }

  /**
   * Handles errors occured by REST service
   *
   * @private
   * @param {HttpErrorResponse} err HTTP reponse error
   * @returns {Observable<never>} observable
   * @memberof TransportLineService
   */
  private handleException(err: HttpErrorResponse): Observable<never> {
    if (err.error) {
      if (err.error.message) {
        return throwError(err.error.message);
      } else if ((typeof err.error === 'string')
        && !err.error.startsWith("Error occured")) {
        return throwError(err.error);
      } else {
        return throwError('Server is down!');
      }
    } else {
      return throwError('Client side error!');
    }
  }
}
