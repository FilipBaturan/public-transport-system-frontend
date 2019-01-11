import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../core/services/report.service';

declare var CanvasJS: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  totalTicketsSold: number = -1;
  startDate: string = "2018-01-01";
  endDate: string = "2018-12-12";
  map : Map<string, number>;
  visitsPerWeek: any[];
  showButton: boolean;
  showWeeklyChart: boolean;
  showMonthlyChart: boolean;
  weeklyData: any[];
  monthlyData: any[];
  weeklyChart: any;
  monthlyChart: any;

  constructor(private toastrService: ToastrService, private reportService: ReportService) {
   }

  ngOnInit() {
    this.showButton = true;

    this.showWeeklyChart = false;
    this.showMonthlyChart = false;

    this.weeklyData = [];
    this.monthlyData = [];

    // setTimeout(() => {
    //   console.log("asdsd");
    // }, 10000)

    this.weeklyChart = new CanvasJS.Chart("weeklyChartContainer", {
      
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Weekly Chart"
      },
      data: [{
        type: "column",
        dataPoints: this.weeklyData,
      }]
    });

    this.weeklyChart.render();
      
    this.monthlyChart = new CanvasJS.Chart("monthlyChartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Monthly Chart"
      },
      data: [{
        type: "column",
        dataPoints: this.monthlyData,
      }]
    });
    
    this.monthlyChart.render();
  }

  refreshCharts()
  {
   
    //
  }

  getPricePerPeriod(){

    this.showWeeklyChart = true;
    this.showMonthlyChart = true;

    this.weeklyData.splice(0,this.weeklyData.length);
    this.monthlyData.splice(0,this.monthlyData.length);
    this.weeklyChart.render();
    this.monthlyChart.render();
    
    if(this.startDate == null || this.endDate == null)
      this.toastrService.error("You did not select both dates!")
    else
    {
      if (this.startDate > this.endDate)
        this.toastrService.error("Your end date is before your start date. Please change that!")
      else
      {
        this.reportService.getReport(this.startDate, this.endDate).subscribe(
          response => {
            this.map = response; 
            for(const key in this.map ) {
              console.log(key + " => " + this.map[key])
            }

            this.reportService.getVisitsPerWeek(this.startDate, this.endDate).subscribe(
              response => {
                
                //counter for total tickets sold
                var counter = 0

                for(const key in response) {
                  this.weeklyData.push({y: response[key], label: this.formWeek(key) })
                  counter += response[key];
                }
                this.totalTicketsSold = counter;
                
                this.weeklyChart.render();

                this.reportService.getVisitsPerMonth(this.startDate, this.endDate).subscribe(
                  response => {              
                    //this.visitsPerWeek = response; 
                    for(const key in response) {
                      this.monthlyData.push({y: response[key], label: key })
                      counter += response[key];
                    }
                   
                    this.monthlyChart.render();
                  }
                );
              }
            );
          }
        ) 
      };
    }
  }

  formWeek(dateString:string)
  {
    var start = dateString.split(",")[1]
    var end = dateString.split(",")[0]

    return start.split("T")[0] + "->" + end.split("T")[0];
  }
  
}
