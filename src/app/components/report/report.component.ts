import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  totalTicketsSold: number;

  showButton: boolean;


  constructor() { }

  ngOnInit() {
    this.showButton = true;
  }

}
