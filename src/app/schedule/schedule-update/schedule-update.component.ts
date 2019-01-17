import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';

import { Schedule } from 'src/app/model/schedule.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { DayOfWeek } from 'src/app/model/enums/day-of-week.model';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-schedule-update',
  templateUrl: './schedule-update.component.html',
  styleUrls: ['./schedule-update.component.css']
})
export class ScheduleUpdateComponent implements OnInit {
  //schedule: Schedule;
  title = "";

  dataSource: any;
  displayedColumns = [];
  columnsToDisplay = []
  @ViewChild(MatSort) sort: MatSort;

  schedules = new Array<Schedule>();
  transportLines = new Array<TransportLine>();

  tableArr: any[] = [];

  daysOfWeekArray = ["WORKDAY", "SATURDAY", "SUNDAY"];

  transportLineDropdown = [];
  selectedItems = [];
  transportLineDropdownSettings = {};

  focusedDeparture: string = "";

  constructor(private scheduleService: ScheduleService,
              private tranposrtLineService: TransportLineService,
              private toastSerivce: ToastrService) { }

  ngOnInit() {
    this.setupSchedules();
    this.setupTransportLineSelect();
    this.dataSource = new MatTableDataSource(this.tableArr);
  }

  setupSchedules(){
    this.scheduleService.findAll().subscribe(
      response => {
        this.schedules = <Array<Schedule>> response;
      },
      (err) => console.error(err)
    );
  }

  setupObj(schedules){
    let obj = {};

    schedules.forEach(element => {
      let tl = element.transportLine.name;
      let workday = tl + "-WORKDAY";
      let saturday = tl + "-SATURDAY";
      let sunday = tl + "-SUNDAY";

      obj[workday] = "";
      obj[saturday] = "";
      obj[sunday] = "";
    });
    
    return obj;
  }

  setupTransportLineSelect(){
    this.transportLineDropdownSettings = { 
      singleSelection: true, 
      text:"Select Transport Lines",
      enableSearchFilter: true,
      enableCheckAll: false,
      maxHeight: 150,
      disabled: false,
      classes:"dropdown transportline-select"
    };

    this.tranposrtLineService.findAll().subscribe(
      response => {
        this.transportLines = <Array<TransportLine>> response;
        
        this.transportLines.forEach(element => {
          this.daysOfWeekArray.forEach(dow=>{
            this.displayedColumns.push(element.name+"-"+dow);
          });
          this.transportLineDropdown.push({"id": element.id, "itemName": element.name});
        });
        console.log(this.transportLineDropdown);
        console.log(this.displayedColumns);
      },
      (err) => console.error(err)
    );
  }

  onItemSelect(item){
    this.columnsToDisplay=[];
    this.tableArr.splice(0,this.tableArr.length);

    this.scheduleService.findScheduleByTransportLineId(item.id).subscribe(
      response => {
        response.forEach(element=> {
          let key = element.transportLine.name + "-" + element.dayOfWeek;
          this.columnsToDisplay.push(key);
          let index = 0;
          element.departures.forEach(departure=>{
            if (this.tableArr[index]){
              this.tableArr[index][key] = departure;
            } else {
              let obj = this.setupObj(response);
              obj[key] = departure;
              this.tableArr.push(obj);
            }
            index++;
          });
        });
        this.dataSource._updateChangeSubscription();
        }
      );
  }

  onItemDeSelect(item:any){
    console.log(this.tableArr);
    this.columnsToDisplay = [];
  }

  addNewRow(){
    let obj = {};
    for (let idx in this.columnsToDisplay){
      obj[this.columnsToDisplay[idx]] = '';
    }

    this.tableArr.push(obj);
    this.dataSource._updateChangeSubscription();
  }

  removeRow(){
    this.tableArr.pop();
    this.dataSource._updateChangeSubscription();
  }

  updateSchedule(){
    let tl = this.selectedItems[0].itemName;

    let workdayDepartures = [];
    let saturdayDepartures = [];
    let sundayDepartures = [];
    
    let workday = tl + "-WORKDAY";
    let saturday = tl + "-SATURDAY";
    let sunday = tl + "-SUNDAY";

    this.tableArr.forEach(element=>{
      if (element[workday])  workdayDepartures.push(element[workday].trim());
      if (element[saturday]) saturdayDepartures.push(element[saturday].trim());
      if (element[sunday])   sundayDepartures.push(element[sunday].trim());
    });

    console.log(workdayDepartures);
    console.log(saturdayDepartures);
    console.log(sundayDepartures);

    this.schedules.forEach(schedule =>{
      if (schedule.transportLine.name == tl){
        if (String(schedule.dayOfWeek) == "WORKDAY"){
          schedule.departures = workdayDepartures;
          this.scheduleService.updateSchedule(schedule).subscribe(
            response => console.log(response)
          );
        }
        else if (String(schedule.dayOfWeek) == "SATURDAY"){
          schedule.departures = saturdayDepartures;
          this.scheduleService.updateSchedule(schedule).subscribe(
            response => console.log(response)
          );
        }
        else if (String(schedule.dayOfWeek) == "SUNDAY"){
          schedule.departures = sundayDepartures;
          this.scheduleService.updateSchedule(schedule).subscribe(
            response => console.log(response)
          );
        }
      }
    });      
  }

  memorizeFocusedDeparture(event, departure: string){
    this.focusedDeparture = departure;
  }

  checkDeparture(departure: string, element, column){
    if (departure == "") return true;

    if (departure.length!=5 || !departure.includes(":")){
      this.toastSerivce.warning("Wrong departure format. The correct format is HH:MM.")
      element[column] = this.focusedDeparture;
      return false;
    }

    let hhMM = departure.split(":");
    let hh = parseInt(hhMM[0]);
    let mm = parseInt(hhMM[1]);
    if (hh<0 || hh>23 || mm<0 || mm>59){
      this.toastSerivce.warning("Hours range from 0 to 23, minutes from 0 to 59!");
      element[column] = this.focusedDeparture;
      return false;
    }

    return true;
  }

  getDayOfWeekEnum (dow: string): DayOfWeek{
    switch(dow.toUpperCase()){
      case "WORKDAY": return DayOfWeek.WORKDAY;
      case "SATURDAY": return DayOfWeek.SATURDAY;
      case "SUNDAY": return DayOfWeek.SUNDAY;
    }
  }

  getStringFromEnum(dow: number){
    switch(dow){
      case 0: return "WORKDAY";
      case 1: return "SATURDAY";
      case 2: return "SUNDAY";
    }
  }
}