import { Component, OnInit } from '@angular/core';
import { Zone } from 'src/app/model/zone.model';
import { ZoneTransportLine } from 'src/app/model/users/zone-transport-line.model';
import { Pricelist } from 'src/app/model/pricelist.model';
import { Reservation } from 'src/app/model/reservation.model';
import { Ticket } from 'src/app/model/ticket.model';
import { Item } from 'src/app/model/item.model';
import { PricelistItem } from 'src/app/model/pricelistItem.model';
import { User } from 'src/app/model/users/user.model';
import { Authentication } from 'src/app/model/authentication.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ZoneService } from 'src/app/core/services/zone.service';
import { PricelistService } from 'src/app/core/services/pricelist.service';
import { ReservationService } from 'src/app/core/services/reservation.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  ageType: string;
  durationType: string;
  transportLineType: string;
  transportType: string;
  purchaseDate: Date;
  zone: Zone;
  zones: Zone[];
  zoneSelect: string;
  lines: ZoneTransportLine[];
  pricelist: Pricelist;
  price: number;
  reservation: Reservation;
  line: number;
  user: User;
  pricelistitemId: number;

  constructor(private authService: AuthService, 
              private zoneService: ZoneService, 
              private pricelistService: PricelistService,
              private reservationService: ReservationService) { }

  ngOnInit() {
    this.pricelistitemId = 0;
    this.reservation = new Reservation(0, [], 21);
    this.price = 0;
    this.transportType = "BUS";
    this.ageType = "REGULAR";
    this.durationType = "ONETIME";
    this.transportLineType = "One line";
    this.authService.getCurrentUser().subscribe(
      result => {
        this.user = result;
        console.log(this.user);
        this.zoneService.findAll().subscribe(
          zones => {
            this.zones = zones;
            this.zone = this.zones[0];
            this.lines = this.zone.lines;
            this.line = this.lines[0].id;
            this.pricelistService.getActivePricelist().subscribe(
              pricelist => {
                this.pricelist = pricelist;
                console.log(this.pricelist);
              }
            )
          }
        )
      }
    )
  }

  zoneChange(zoneName: string): void{
    for(const zone of this.zones){
      if(zone.name === zoneName){
        this.zone = zone;
        this.lines = this.zone.lines;
      }
    }
  }

  lineChange(lineName: string): void{
    for(const line of this.lines){
      if(line.name === lineName){
        this.line = line.id;
      }
    }
  }

  checkPrice(): void{
    for(const pricelistitem of this.pricelist.items){
      if(pricelistitem.item.type === this.durationType && pricelistitem.item.age === this.ageType
         && pricelistitem.item.vehicleType === this.transportType && pricelistitem.item.zone === this.zone.id){ 
          this.price += pricelistitem.item.cost;
          this.pricelistitemId = pricelistitem.id;
          return;
      }
    }
  }

  check(): void{
    let feedback = this.checkAndSetExpiryDate();
    if(feedback === 0){
      this.checkPrice();
      let t = new Ticket(this.purchaseDate, this.line, this.pricelistitemId, this.durationType);
      this.reservation.tickets.push(t);
      console.log(this.reservation);
    }
    else if(feedback === 1){
      console.log("Unesite datum!");
    }
    else if(feedback === 2){
      console.log("Unesite validan datum!");
    }
  }

  checkAndSetExpiryDate(): number{
    if(!this.purchaseDate){
      return 1;
    }
    if(this.purchaseDate.getTime() < Date.now()){
      return 2;
    }
    return 0;
  }

  reserve(): void{
    this.reservationService.create<Reservation>(this.reservation, "reserve").subscribe(
      result => {
        console.log("Jeeeee");
      }
    );
  }

}
