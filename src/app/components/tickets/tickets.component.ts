import { Component, OnInit } from '@angular/core';
import { Zone } from 'src/app/model/zone.model';
import { ZoneTransportLine } from 'src/app/model/zone.model';
import { Pricelist } from 'src/app/model/pricelist.model';
import { Reservation } from 'src/app/model/reservation.model';
import { Ticket } from 'src/app/model/ticket.model';
import { User } from 'src/app/model/users/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ZoneService } from 'src/app/core/services/zone.service';
import { PricelistService } from 'src/app/core/services/pricelist.service';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Image } from 'src/app/model/util.model';
import { UploadService } from 'src/app/core/services/upload.service';

import * as jsPDF from 'jspdf';

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
  monthlyAnnualSelected: boolean;
  choice: boolean;
  selectedFile: File;
  imagePath: string;
  image: Image;

  constructor(private authService: AuthService, private zoneService: ZoneService,
              private pricelistService: PricelistService, private reservationService: ReservationService,
              private toastr: ToastrService, private router: Router,
              private uploadService: UploadService) {
                this.selectedFile = null;
                this.image = {content: '', format: ''};
                this.pricelistService.getActivePricelist().subscribe(
                  pricelist => {
                    this.pricelist = pricelist;
                  }
                );
              }

  ngOnInit() {
    this.choice = true;
    this.dailySelected = false;
    this.monthlyAnnualSelected = false;
    this.pricelistitemId = 0;
    this.reservation = {id: 0, tickets: [], owner: 0};
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
          }
        );
      }
    );
  }

  chooseType(type: string): void {
    if (type === 'DAILY') {
      this.dailySelected = true;
      this.monthlyAnnualSelected = false;
      this.choice = false;
      this.durationType = 'ONETIME';
      this.ageType = 'ALL';
    } else if (type === 'MONTHLY_ANNUAL') {
      this.dailySelected = false;
      this.monthlyAnnualSelected = true;
      this.choice = false;
      this.durationType = 'MONTHLY';
      this.purchaseDate = new Date(Date.now());
    }
  }

  zoneChange(zoneName: string): void {
    for (const zone of this.zones) {
      if (zone.name === zoneName) {
        this.zone = zone;
        this.lines = this.zone.lines;
        this.line = this.lines[0].id;
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
    console.log(this.pricelist);
    console.log(this.ageType);
    console.log(this.durationType);
    console.log(this.transportType);
    console.log(this.zone);
    for (const pricelistitem of this.pricelist.items) {
      if (pricelistitem.item.type === this.durationType && pricelistitem.item.age === this.ageType
         && pricelistitem.item.vehicleType === this.transportType && pricelistitem.item.zone === this.zone.id) {
          console.log(pricelistitem);
          this.pricelistitemId = pricelistitem.id;
          return;
      }
    }
  }

  get filterByTransport() {
    return this.zone.lines.filter( x => x.type === this.transportType);
  }

  check(): void {
    const feedback = this.checkPurchaseDate();
    if (feedback === 0) {
      this.checkPrice();
      const t = new Ticket(this.purchaseDate, this.line, this.pricelistitemId, this.durationType);
      this.reservation.tickets.push(t);
      this.toastr.success('Successfully added ticket to reservation');
    } else if (feedback === 1) {
      this.toastr.warning('Choose date!');
    } else if (feedback === 2) {
      this.toastr.warning('Choose valid date!');
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
        this.reservation.tickets.forEach(t=>{
          let doc = new jsPDF();

          let day = t.purchaseDate.getDate();
          let monthIndex = t.purchaseDate.getMonth();
          let year = t.purchaseDate.getFullYear();

          let date = day + '.' + monthIndex+1 + '.' + year;

          doc.text(20, 20,"Transport line: " + t.line);
          doc.text(20, 30,"Purchased on: " + date);
          doc.text(20, 40,"Ticket type: " + t.ticketType);
          doc.save('ticket.pdf');
        })
        this.toastr.success('Successfully reserved!');
        this.router.navigate(['/welcome']);
      }
    );
  }

  reserveTicket(): void {
    if (this.checkIfDocumentIsChoosen()) {
      this.checkPrice();
      const t = new Ticket(this.purchaseDate, this.line, this.pricelistitemId, this.durationType);
      this.reservation.tickets.push(t);
      this.reservationService.create<Reservation>(this.reservation, 'reserve').subscribe (
        result => {
          if (this.ageType === 'REGULAR') {
            let doc = new jsPDF();

            let day = t.purchaseDate.getDate();
            let monthIndex = t.purchaseDate.getMonth();
            let year = t.purchaseDate.getFullYear();

            let date = day + '.' + monthIndex+1 + '.' + year;
            
            
            doc.text(20, 20,"Transport line: " + t.line);
            doc.text(20, 30,"Purchased on: " + date);
            doc.text(20, 40,"Ticket type: " + t.ticketType);
            doc.save('ticket.pdf');

            this.toastr.success('Successfully reserved!');
            this.router.navigate(['/welcome']);
          } else {
            this.authService.setImageToUser({id: this.user.id, image: this.imagePath}).subscribe(
              response => {
                let doc = new jsPDF();

                let day = t.purchaseDate.getDate();
                let monthIndex = t.purchaseDate.getMonth();
                let year = t.purchaseDate.getFullYear();

                let date = day + '.' + monthIndex+1 + '.' + year;

                doc.text(20, 20,"Transport line: " + t.line);
                doc.text(20, 30,"Purchased on: " + date);
                doc.text(20, 40,"Ticket type: " + t.ticketType);
                doc.save('ticket.pdf');
                          
                this.toastr.success('Successfully reserved!');
                this.router.navigate(['/welcome']);
              }
            );
          }
        }
      );
    } else {
      this.toastr.warning('Please, choose document for validation (click Upload if picture if choosen)!');
    }
  }

  checkIfDocumentIsChoosen(): boolean {
    if (this.ageType !== 'REGULAR') {
      if (this.imagePath !== undefined) {
        return true;
      }
      return false;
    }
    return true;
  }

  onFileSelected(event: { target: { files: File[]; }; }) {
    this.selectedFile = event.target.files[0] as File;
  }

  onUpload() {
    const uploadData: FormData = new FormData();
    uploadData.append('image', this.selectedFile, this.selectedFile.name);
    this.uploadService.uploadImage(uploadData).subscribe(
      res => {
        this.imagePath = res;
      },
      error => { console.log(error); });
  }

  onLoad() {
    this.uploadService.getImage(this.imagePath).subscribe(
      res => { this.image = res; },
      error => { console.log(error); }
    );
  }

}
