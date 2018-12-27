import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RestService } from './rest.service';
import { ToastrService } from 'ngx-toastr';
import { Zone } from 'src/app/model/zone.model';

/**
 * Provide REST service for vehicle
 *
 * @export
 * @class ZoneService
 * @extends {RestService<Zone>}
 */
@Injectable({
  providedIn: 'root'
})
export class ZoneService extends RestService<Zone> {

  /**
   * Creates an instance of ZoneService.
   * @param {HttpClient} http HTTP REST service
   * @param {ToastrService} toastrService user notification service
   * @memberof ZoneService
   */
  constructor(http: HttpClient, toastrService: ToastrService) {
    super(http, ["/api/zone"], toastrService);
  }

  /**
   * Remove target zone
   *
   * @param {number} id target zone id
   * @param {Zone[]} zones all available zones
   * @memberof ZoneService
   */
  remove(id: number, zones: Zone[]): void {
    this.http.delete(this.url() + "/" + id, { responseType: "text" as "text" }).
      subscribe(() => {
        let temp: Zone[];
        this.findAll().subscribe(result => {
          temp = result;
          for (let index = 0; index < temp.length; index++) {
            const zone = temp[index];
            zones[index] = zone;
          }
          zones.length = temp.length;
          this.toastr.success("Zone successfuly deleted!");
        });
      }, err => this.toastr.error(err.error));
  }
}
