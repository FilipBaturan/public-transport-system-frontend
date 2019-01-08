import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { RestService } from './rest.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Schedule } from 'src/app/model/schedule.model';
import { DayOfWeek } from 'src/app/model/enums/day-of-week.model';

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

  updateSchedule(schedule: Schedule){
    console.log(schedule);
    return this.http.put<any>(this.url(['updateSchedule']), schedule).pipe(
      catchError(this.handleError<boolean>())
    );
  }
}
