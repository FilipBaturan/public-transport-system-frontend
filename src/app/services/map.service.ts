import { Injectable } from '@angular/core';


import { TransportLine, TransportLineViewer } from '../model/transport-line.model';
import { TransportLineService } from './transport-line.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  

  constructor(
    private transportLineService: TransportLineService) {
     
   }
   
}
