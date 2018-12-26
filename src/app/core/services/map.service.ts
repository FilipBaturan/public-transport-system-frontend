import { Injectable } from '@angular/core';


import { TransportLineService } from './transport-line.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  

  constructor(
    private transportLineService: TransportLineService) {
     
   }
   
}
