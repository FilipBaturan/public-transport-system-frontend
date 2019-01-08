import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';

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

  constructor(private scheduleService: ScheduleService,
              private tranposrtLineService: TransportLineService) { }

  ngOnInit() {
    //this.setupScheduleTable();
    this.setupDataSource();
    this.setupTransportLineSelect();
  }

  setupDataSource(){
    this.scheduleService.findAll().subscribe(
      response => {
        this.schedules = <Array<Schedule>> response;
        let temp = this.tableArr.map(x => Object.assign({}, x));
        response.forEach(element => {
          let index = 0;
          element.departures.forEach(departure => {
            let key = element.transportLine.name + "-" + element.dayOfWeek;
            console.log(key);
            if (this.tableArr.length==0){
              let obj = {};
              obj[key] = departure;
              temp.push(obj);
            }else{
              temp[index][key] = departure;
            }index++;
          });
          this.tableArr = temp;
        });
        this.dataSource = new MatTableDataSource(this.tableArr);
        console.log(this.tableArr);
      },
      (err) => console.error(err)
    );
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

  filterSchedules(transportLine: string, dayOfWeek: DayOfWeek){
    let dow = this.getStringFromEnum(dayOfWeek);
    let bla = String(transportLine+"-"+dow);
    this.columnsToDisplay.push(bla);
  }

  onItemSelect(item){
    this.columnsToDisplay=[];
      this.filterSchedules(item.itemName, DayOfWeek.WORKDAY);
      this.filterSchedules(item.itemName, DayOfWeek.SATURDAY);
      this.filterSchedules(item.itemName, DayOfWeek.SUNDAY);
      console.log(this.dataSource);
      //this.selectedItems = [];
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
      workdayDepartures.push(element[workday]);
      saturdayDepartures.push(element[saturday]);
      sundayDepartures.push(element[sunday]);
    });

    console.log(workdayDepartures);
    console.log(saturdayDepartures);
    console.log(sundayDepartures);

    this.schedules.forEach(schedule =>{
      if (schedule.transportLine.name == tl){
        if (String(schedule.dayOfWeek) == "WORKDAY"){
          schedule.departures = workdayDepartures;
          this.scheduleService.updateSchedule(schedule);
        }
        else if (String(schedule.dayOfWeek) == "SATURDAY"){
          schedule.departures = saturdayDepartures;
          this.scheduleService.updateSchedule(schedule);
        }
        else if (String(schedule.dayOfWeek) == "SUNDAY"){
          schedule.departures = sundayDepartures;
          this.scheduleService.updateSchedule(schedule);
        }
      }
    });      
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
