import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { RestService } from './rest.service';
import { Schedule } from 'src/app/model/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends RestService<Schedule> {

  constructor(http: HttpClient, toastr: ToastrService) {
    super(http, ['/api/schedule'], toastr);
  }

  findScheduleByTrLineIdAndDayOfWeek(id: number, dayOfWeek: string): Observable<Schedule>{
    return this.http.get<any>(
      this.url() + 'findByTrLineIdAndDayOfWeek/' + id,
        { params: { 'dayOfWeek': String(dayOfWeek).toUpperCase() } }
    ).pipe(
      catchError(this.handleError<any>())
      );
  }

  findScheduleByTransportLineId(id: number): Observable<Schedule[]>{
    return this.http.get<Schedule[]>(
      this.url() + 'findByTransportLineId/' + id
    ).pipe(
      catchError(this.handleError<Schedule[]>())
      );
  }

  updateSchedule(schedule: Schedule[]){
    return this.http.put<any>(this.url(['updateSchedule']), schedule
    ).pipe(
      catchError(this.handleError<boolean>())//this.handleError<boolean>())
    );
  }
}