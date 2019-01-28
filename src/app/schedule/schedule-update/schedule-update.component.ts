import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { Schedule } from 'src/app/model/schedule.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { DayOfWeek } from 'src/app/model/enums/day-of-week.model';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';

@Component({
  selector: 'app-schedule-update',
  templateUrl: './schedule-update.component.html',
  styleUrls: ['./schedule-update.component.css']
})
export class ScheduleUpdateComponent implements OnInit {
  title = "";

  dataSource: any;
  displayedColumns = [];
  columnsToDisplay = [];
  @ViewChild(MatSort) sort: MatSort;

  schedules = new Array<Schedule>();
  transportLines = new Array<TransportLine>();

  tableArr: any[] = [];

  daysOfWeekArray = ["WORKDAY", "SATURDAY", "SUNDAY"];
  displayedSchedules = [];

  transportLineDropdown = [];
  selectedItems = [];
  transportLineDropdownSettings = {};

  focusedDeparture: string = "";
  refreshing: boolean = false;

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
        console.log(response);
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
      },
      (err) => console.error(err)
    );
  }

  onItemSelect(item){
    this.columnsToDisplay=[];
    this.tableArr.splice(0,this.tableArr.length);

    this.scheduleService.findScheduleByTransportLineId(item.id).subscribe(
      response => {
        this.refreshDeparturesView(response);
        this.columnsToDisplay.push(item.itemName+"-WORKDAY");
        this.columnsToDisplay.push(item.itemName+"-SATURDAY");
        this.columnsToDisplay.push(item.itemName+"-SUNDAY");
        this.dataSource._updateChangeSubscription();
        }
      );
  }

  refreshDeparturesView(response){
    response.forEach(element=> {
      let key = element.transportLine.name + "-" + element.dayOfWeek;
      let idx = this.displayedSchedules.indexOf(key);
      if (idx==-1){
          this.displayedSchedules.push(key);
        }
      //this.columnsToDisplay.push(key);
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
  }

  onItemDeSelect(item:any){
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
    this.refreshing = true;
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

    let schedulesToUpdate = [] as Schedule[];

    this.schedules.forEach(schedule =>{
      console.log(schedule.dayOfWeek);
      if (schedule.transportLine.name == tl){
        if (String(schedule.dayOfWeek) == "WORKDAY"){
          schedule.departures = workdayDepartures;
          schedulesToUpdate.push(schedule);
          
        }
        else if (String(schedule.dayOfWeek) == "SATURDAY"){
          schedule.departures = saturdayDepartures;
          schedulesToUpdate.push(schedule);
        }
        else if (String(schedule.dayOfWeek) == "SUNDAY"){
          schedule.departures = sundayDepartures;
          schedulesToUpdate.push(schedule);
        }
      }
    });
    this.scheduleService.updateSchedule(schedulesToUpdate).subscribe(
      response => {
        console.log(response);
        this.refreshing = false;
        this.toastSerivce.success("Schedules successfully updated!");
      },
      (error)=>{
        this.refreshing = false;
        this.toastSerivce.warning("Can't update a schedule with a unknown transport line!");
      }
    );

  }

  addSchedule(column){
    let tlName = column.split("-")[0];
    let dow = column.split("-")[1];
    this.refreshing = true;
    let tl = this.findTransportLine(tlName);
    if (tl == null){
      this.toastSerivce.warning("Transport line doesn't exist!");
      this.refreshing = false;
      return;
    }
    let schedule = this.findSchedule(column);
    if (schedule == null){
      schedule = {
        departures: [],
        transportLine: tl,
        dayOfWeek: this.getDayOfWeekEnum(dow.toUpperCase()),
        active: true
      } as Schedule;
    }
    schedule.departures=[];
    schedule.active=true;
    
    this.scheduleService.create(schedule).subscribe(
      response=>{
        this.schedules.push(response as Schedule);
        this.refreshDeparturesView([response as Schedule]);
        this.refreshing = false;
        this.toastSerivce.success("Schedule successfully created.");
      },
      (error)=>{
        this.refreshing = false;
        this.toastSerivce.warning("Schedule already exists!");
      });
  }

  removeSchedule(column){
    this.refreshing = true;
    let schedule = this.findSchedule(column);
    if (schedule != null){
      schedule.departures=[];
      schedule.active = false;
      this.scheduleService.updateSchedule([schedule] as Schedule[]).subscribe(
        (response) => {
          this.toastSerivce.success("Schedule successfully removed.");
          let idx = this.displayedSchedules.indexOf(column);
          if (idx!=-1)
            this.displayedSchedules.splice(idx,1);
          this.deleteFromTable(column);
          this.refreshing = false;
        },
        (error)=>{
          this.refreshing = false;
          this.toastSerivce.warning("Schedule already exists!");
        });
    } else {
      this.refreshing = false;
      this.toastSerivce.warning("Schedule doesn't exist!");
    }
  }

  deleteFromTable(column){
    this.tableArr.forEach(obj=>{
      if (obj[column])
        obj[column] = "";
    });
    this.dataSource._updateChangeSubscription();
  }

  checkIfScheduleExists(header: string){
    if (this.displayedSchedules.indexOf(header)!=-1){
      return true;
    } else {
      return false;
    }
  }

  findTransportLine(tlName){
    let found = false;
    let transportLine = {} as TransportLine;
    this.transportLines.forEach(tl => {
      if(tl.name == String(tlName)){
        found = true;
        transportLine = tl; 
      }
    });
    if (found)
      return transportLine;
    else
      return null;
  }

  findSchedule(column){
    let tlName = column.split("-")[0];
    let dow = column.split("-")[1];
    let found = false;
    let schedule = {} as Schedule;

    this.schedules.forEach(s => {
      if(s.transportLine.name == String(tlName) &&
         String(s.dayOfWeek) == dow.toUpperCase()){
          found = true;
          schedule = s;
      }  
    });
    if (found)
      return schedule;
    else
      return null;
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
}