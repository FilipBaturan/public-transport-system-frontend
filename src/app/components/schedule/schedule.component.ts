import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule } from 'src/app/model/schedule.model';

import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { TransportLine } from 'src/app/model/transport-line.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  //schedule: Schedule;
  title = "";

  dataSource: any;
  displayedColumns = [];
  @ViewChild(MatSort) sort: MatSort;

  schedule = new Array<Schedule>();
  transportLines = new Array<TransportLine>();

  columnNames = [{
        id: "departure",
        value: "Departure"
      }];


  constructor(private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.displayedColumns = this.columnNames.map(x => x.id);
    this.scheduleService.findAll().subscribe(

      response=> {
        //this.schedule = <Schedule> response[0];
        this.schedule = <Array<Schedule>> response;
        //this.rows = this.rows[0].departures;
        this.title = this.schedule[0].transportLine.name;

        this.transportLines.push(this.schedule[0].transportLine);

        this.fillTable();
        console.log(this.title);
        console.log(response[0]);
      },
      (err) => console.error(err) 
     
    );
  }

  fillTable(){
    let tableArr: Element[] = [];

    this.schedule[0].departures.forEach(element => {

      tableArr.push({departure: element});
      
    });
    console.log(tableArr);
    this.dataSource = new MatTableDataSource(tableArr);
  }



  display(){
    //console.log(this.schedule);
    console.log(this.schedule);
  }

}

export interface Element {
  departure: string
}
