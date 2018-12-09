import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  totalTicketsSold: number;
  startDate: Date = null;
  endDate: Date = null;
  map : any;

  showButton: boolean;
  


  constructor(private toastrService: ToastrService, private reportService: ReportService) { }

  ngOnInit() {
    this.showButton = true;
  }

  getPricePerPeriod(){

    if(this.startDate == null || this.endDate == null)
      this.toastrService.error("You did not select both dates!")
    else
    {
      if (this.startDate > this.endDate)
        this.toastrService.error("Your end date is before your start date. Please change that!")
      else
      {
        this.reportService.getReport(this.startDate, this.endDate).subscribe(
          response => {this.map = response; 
            this.toastrService.info("Did it");
          }
        )
      }
        //this.toastrService.info("Start date: " + this.startDate + "\nEnd date: " + this.endDate);
    }

    
  }


}
