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
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
  dailySelected: boolean;
  monthlySelected: boolean;
  annualSelected: boolean;

  constructor(private authService: AuthService,
              private zoneService: ZoneService,
              private pricelistService: PricelistService,
              private reservationService: ReservationService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit() {
    this.dailySelected = true;
    this.monthlySelected = false;
    this.annualSelected = false;
    this.pricelistitemId = 0;
    this.reservation = new Reservation(0, [], 0);
    this.price = 0;
    this.transportType = 'BUS';
    this.ageType = 'REGULAR';
    this.durationType = 'ONETIME';
    this.transportLineType = 'One line';
    this.authService.getCurrentUser().subscribe(
      result => {
        this.user = result;
        this.reservation.owner = this.user.id;
        this.zoneService.findAll().subscribe(
          zones => {
            this.zones = zones;
            this.zone = this.zones[0];
            this.lines = this.zone.lines;
            this.line = this.lines[0].id;
            this.pricelistService.getActivePricelist().subscribe(
              pricelist => {
                this.pricelist = pricelist;
              }
            );
          }
        );
      }
    );
  }

  chooseType(type: string): void {
    if (type === 'DAILY') {
      this.dailySelected = true;
      this.monthlySelected = false;
      this.annualSelected = false;
      this.durationType = 'ONETIME';
    } else if (type === 'MONTHLY') {
      this.dailySelected = false;
      this.monthlySelected = true;
      this.annualSelected = false;
      this.durationType = 'MONTHLY';
      this.purchaseDate = new Date(Date.now());
    } else if (type === 'ANNUAL') {
      this.dailySelected = false;
      this.monthlySelected = false;
      this.annualSelected = true;
      this.durationType = 'ANNUAL';
      this.purchaseDate = new Date(Date.now());
    }
  }

  zoneChange(zoneName: string): void {
    for (const zone of this.zones) {
      if (zone.name === zoneName) {
        this.zone = zone;
        this.lines = this.zone.lines;
      }
    }
  }

  lineChange(lineName: string): void {
    for (const line of this.lines) {
      if (line.name === lineName) {
        this.line = line.id;
      }
    }
  }

  checkPrice(): void {
    for (const pricelistitem of this.pricelist.items) {
      if (pricelistitem.item.type === this.durationType && pricelistitem.item.age === this.ageType
         && pricelistitem.item.vehicleType === this.transportType && pricelistitem.item.zone === this.zone.id) {
          this.price += pricelistitem.item.cost;
          this.pricelistitemId = pricelistitem.id;
          return;
      }
    }
  }

  check(): void {
    const feedback = this.checkPurchaseDate();
    if (feedback === 0) {
      this.checkPrice();
      const t = new Ticket(this.purchaseDate, this.line, this.pricelistitemId, this.durationType);
      this.reservation.tickets.push(t);
      this.toastr.success('Uspesno ste dodali kartu u rezervaciju');
    } else if (feedback === 1) {
      this.toastr.warning('Odaberite datum!');
    } else if (feedback === 2) {
      this.toastr.warning('Odaberite validan datum!');
    }
  }

  checkPurchaseDate(): number {
    if (!this.purchaseDate) {
      return 1;
    }
    if (this.purchaseDate.getTime() < (Date.now() - 86400000)) {
      return 2;
    }
    return 0;
  }

  reserve(): void {
    this.reservationService.create<Reservation>(this.reservation, 'reserve').subscribe (
      result => {
        this.toastr.success('Rezervacija je uspesno izvrsena');
        this.router.navigate(['/welcome']);
      }
    );
  }

}
