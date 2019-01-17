import { Component, OnInit, ViewChild } from '@angular/core';
import { Schedule } from 'src/app/model/schedule.model';

import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { TransportLine } from 'src/app/model/transport-line.model';
import { DayOfWeek } from 'src/app/model/enums/day-of-week.model';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { ToastrService } from 'ngx-toastr';

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
              private tranposrtLineService: TransportLineService,
              private toastrSerivce: ToastrService) { }

  ngOnInit() {
    this.setupTransportLineSelect();
    this.setupDayOfWeekSelect();
    this.dataSource = new MatTableDataSource(this.tableArr);
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

  onItemSelect(item){
    if (this.selectedItem.length){
      let dow = this.selectedItem[0].itemName;
      this.scheduleService.findScheduleByTrLineIdAndDayOfWeek(item.id,dow).subscribe(
        response => {
          let key = response.transportLine.name + "-" + response.dayOfWeek;
          this.columnsToDisplay.push(key);
          let index = 0;
          response.departures.forEach(departure=>{
            if (this.tableArr[index]){
              this.tableArr[index][key] = departure;
            } else {
              let obj = {};
              obj[key] = departure;
              this.tableArr.push(obj);
            }
            index++;
          });
          console.log(this.tableArr);
          this.dataSource._updateChangeSubscription();
        }, err =>{
          let index = this.selectedItems.findIndex(i => i.id == item.id);
          console.log(this.selectedItems[0]);
          console.log(item.id);
          console.log(index);
          this.selectedItems.splice(index,1);
        });
    } 
    else {
      this.toastrSerivce.info("Select the day of week first!");
      this.selectedItems = [];
    }
  }

  onItemDeSelect(item:any){
    let upper = this.selectedItem[0].itemName.toUpperCase();
    let keyword = item.itemName + '-' + upper;
    let index = this.columnsToDisplay.findIndex(d => d == keyword);
    if (index == -1) return;
    this.columnsToDisplay.splice(index, 1);
    this.updateTableColumns(keyword);
  }

  onDayOfWeekSelect(item){
    let dow = this.getDayOfWeekEnum(item.itemName);
    this.columnsToDisplay = [];
    this.selectedItems = [];
    this.tableArr.splice(0,this.tableArr.length);
    this.dataSource._updateChangeSubscription();
  }

  onDayOfWeekDeSelect(item:any){
    this.columnsToDisplay = [];
    this.selectedItems = [];
    this.tableArr.splice(0,this.tableArr.length);
    this.dataSource._updateChangeSubscription();
  }

  updateTableColumns(key: string){
    console.log(this.tableArr);
    let idx = 0;
    let del = -1;
    this.tableArr.forEach(obj => {
      delete obj[key];
      if(this.isEmpty(obj)){
        del = idx;
        this.tableArr.splice(del, 1);
      }
      idx++;
    });
    //this.tableArr = this.tableArr.filter(obj => !this.isEmpty(obj));

    this.dataSource._updateChangeSubscription();
    console.log(this.tableArr);
  }

  isEmpty(obj): boolean {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
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