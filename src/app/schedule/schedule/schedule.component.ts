import { Component, OnInit, ViewChild } from '@angular/core';
import { Schedule } from 'src/app/model/schedule.model';

import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { TransportLine } from 'src/app/model/transport-line.model';
import { DayOfWeek } from 'src/app/model/enums/day-of-week.model';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';

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
  columnsToDisplay = []
  @ViewChild(MatSort) sort: MatSort;

  schedules = new Array<Schedule>();
  transportLines = new Array<TransportLine>();

  tableArr: any[] = [];

  daysOfWeekArray = ["WORKDAY", "SATURDAY", "SUNDAY"];

  transportLineDropdown = [];
  selectedItems = [];
  transportLineDropdownSettings = {};

  dayOfWeekDropdown = [];
  selectedItem = [];
  dayOfWeekDropdownSettings = {};

  constructor(private scheduleService: ScheduleService,
              private tranposrtLineService: TransportLineService) { }

  ngOnInit() {
    //this.setupScheduleTable();
    this.setupDataSource();
    this.setupTransportLineSelect();
    this.setupDayOfWeekSelect();
  }

  setupDataSource(){
    this.scheduleService.findAll().subscribe(
      response => {
        this.schedules = <Array<Schedule>> response;
        console.log(response);
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
              if (temp[index])
                temp[index][key] = departure;
              else{
                let obj = this.setupObj(response);
                obj[key] = departure;
                temp.push(obj);
              }
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
      singleSelection: false, 
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

  setupDayOfWeekSelect(){
    this.dayOfWeekDropdownSettings = { 
      singleSelection: true, 
      text:"Select Day of Week",
      enableSearchFilter: false,
      enableCheckAll: false,
      //showCheckbox: false,
      maxHeight: 150,
      classes:"dropdown dayofweek-select"
    };

    this.dayOfWeekDropdown.push({"id": 1, "itemName": "Workday"});
    this.dayOfWeekDropdown.push({"id": 2, "itemName": "Saturday"});
    this.dayOfWeekDropdown.push({"id": 3, "itemName": "Sunday"});

  }

  filterSchedules(transportLine: string, dayOfWeek: DayOfWeek){
    let dow = this.getStringFromEnum(dayOfWeek);
    let bla = String(transportLine+"-"+dow);
    this.columnsToDisplay.push(bla);
    console.log(transportLine+"-"+dow);
    console.log(this.tableArr[0]["R1-WORKDAY"]);
    /*this.schedules.forEach(element => {
      if (element.transportLine.name == transportLine && element.dayOfWeek.toString() == dow){
        this.columnsToDisplay.push(element.transportLine.name);
        console.log(dow, element.dayOfWeek, element.transportLine.name, element)
      }
        
    });*/
  }

  onItemSelect(item){
    if(this.selectedItem.length){
      //this.columnsToDisplay.push(item.itemName);
      let dow = this.getDayOfWeekEnum(this.selectedItem[0].itemName);
      this.filterSchedules(item.itemName, dow);
    } else{
      this.selectedItems = [];
    }
  }

  onItemDeSelect(item:any){
      let index = this.columnsToDisplay.findIndex(d => d === item.itemName);
      this.columnsToDisplay.splice(index, 1);
      //this.transportLineDropdownSettings["disabled"] = true;
      console.log(this.transportLineDropdownSettings);
  }

  onDayOfWeekSelect(item){
    let dow = this.getDayOfWeekEnum(item.itemName);
    this.columnsToDisplay = [];
    this.selectedItems = [];
    //this.transportLineDropdownSettings["disabled"] = false;
    console.log(this.transportLineDropdownSettings);
  }

  onDayOfWeekDeSelect(item:any){
    this.columnsToDisplay = [];
    this.selectedItems = [];
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
