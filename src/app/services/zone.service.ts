import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestService } from './rest.service';
import { Zone } from '../model/zone.model';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ZoneService extends RestService<Zone> {

  private zoneURL: string = "/api/zone";

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ["/api/zone"], toastr);
  }

  remove(id: number, zones: Zone[]): void  {
    this.http.delete(this.zoneURL + "/" + id, {responseType: "text" as "text"}).
    subscribe( () => {
      let temp:Zone[];
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
