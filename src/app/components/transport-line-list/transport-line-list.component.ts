import { Component, OnInit } from '@angular/core';
import { TransportLineService } from '../../services/transport-line.service';
import { Observable } from 'rxjs';
import { TransportLine } from '../../model/transport-line.model';


@Component({
  selector: 'app-transport-line-list',
  templateUrl: './transport-line-list.component.html',
  styleUrls: ['./transport-line-list.component.css']
})
export class TransportLineListComponent implements OnInit {

  transportLines : TransportLine[];
  
  constructor(private transportLineService: TransportLineService) { }

  ngOnInit() {
    
    this.transportLines = [];

    this.transportLineService.findAll().subscribe(

      response=> this.transportLines = response,
      (err) => console.error(err) 
     
    )
  }

  showStations(transportLineId:number) 
  {
    console.log("Mapa: " + transportLineId);
  }


}
