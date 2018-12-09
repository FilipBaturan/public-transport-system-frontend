import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { RestService } from './rest.service';
import { Schedule } from '../model/schedule.model';
import { ScheduleTransportLineDTO } from '../model/dto/schedule-transport-line.dto';
import { DayOfWeek } from '../model/enums/day-of-week.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends RestService<Schedule> {

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/schedule'], toastr);
  }

  findScheduleByTransportLine(id: number, dayOfWeek: DayOfWeek): Observable<Schedule>{
    console.log(this.url() + 'findByTransportLine');

    return this.http.get<Schedule>(
      this.url() + 'findByTransportLine/' + id,  { params: { 'dayOfWeek': String(dayOfWeek) } }
    ).pipe(
      catchError(this.handleError<Schedule>())
      );
  }
}
