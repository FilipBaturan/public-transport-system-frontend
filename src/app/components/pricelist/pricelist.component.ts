import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PricelistService } from 'src/app/core/services/pricelist.service';
import { ZoneService } from 'src/app/core/services/zone.service';
import { Zone } from 'src/app/model/zone.model';
import { Item } from 'src/app/model/item.model';
import { Pricelist } from 'src/app/model/pricelist.model';
import { PricelistItem } from 'src/app/model/pricelistItem.model';

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  zones: Zone[];
  items: Item[];
  itemsToFill: Array<Array<Item>>;
  pricelist: Pricelist;
  pricelistItems: PricelistItem[];
  modifyingPricelist: Pricelist;
  choice: boolean;
  creating: boolean;
  modifying: boolean;

  constructor(private toastr: ToastrService, private pricelistService: PricelistService,
              private zoneService: ZoneService) { }

  ngOnInit() {
    this.choice = true;
    this.creating = false;
    this.modifying = false;
    this.zoneService.findAll().subscribe(
      response => {
        this.zones = response;
      }
    );
  }

  check(): void {
    const feedback = this.checkPurchaseDate();
    if (feedback === 0) {
    } else if (feedback === 1) {
      this.toastr.warning('Choose both dates!');
    } else if (feedback === 2) {
      this.toastr.warning('Choose valid dates!');
    }
  }

  checkPurchaseDate(): number {
    if (!this.startDate || !this.endDate) {
      return 1;
    }
    if (this.startDate.getTime() < (Date.now() - 86400000) || this.startDate.getTime() >= this.endDate.getTime()) {
      return 2;
    }
    return 0;
  }

  create(): void {
    this.modifying = false;
    this.creating = true;
    this.choice = false;
    this.generateItems();
  }

  modify(): void {
    this.modifying = true;
    this.creating = false;
    this.choice = false;
    this.getActive();
  }

  generateItems(): void {
    this.items = [];
    const ages = ['STUDENT', 'PENSIONER', 'REGULAR'];
    const vehicles = ['BUS', 'TRAM', 'METRO'];
    const dayTypes = ['ONETIME', 'DAILY'];
    for (const zone of this.zones) {
      for (const vehicle of vehicles) {
        for (const type of dayTypes) {
          this.items.push({id: null, type: type, age: 'ALL', cost: undefined, vehicleType: vehicle, zone: zone.id});
        }
      }
    }
    const longerTypes = ['MONTHLY', 'ANNUAL'];
    for (const zone of this.zones) {
      for (const age of ages) {
        for (const vehicle of vehicles) {
          for (const type of longerTypes) {
            this.items.push({id: null, type: type, age: age, cost: undefined, vehicleType: vehicle, zone: zone.id});
          }
        }
      }
    }
    this.itemsToFill = this.separateItemsByZones(this.items);
  }

  separateItemsByZones(items: Item[]): Array<Array<Item>> {
    const itemsByZone = [];
    for (const zone of this.zones) {
      const oneZoneItems = [];
      for (const item of items) {
        if (item.zone === zone.id) {
          oneZoneItems.push(item);
        }
      }
      itemsByZone.push(oneZoneItems);
    }
    return itemsByZone;
  }

  saveCreated(): void {
    const flag = this.checkPurchaseDate();
    if (flag === 0) {
      if (!this.priceValidation()) {
        this.toastr.warning('All prices should be correctly inserted!');
      } else {
        this.pricelistItems = [];
        for (const item of this.items) {
          this.pricelistItems.push({id: null, item: item});
        }
        this.pricelist = {id: null, startDate: this.startDate, endDate: this.endDate, items: this.pricelistItems};
        this.pricelistService.create(this.pricelist).subscribe(
          response => {
            this.toastr.success('Successfully created price list!');
            this.creating = false;
            this.modifying = false;
            this.choice = true;
            this.items = [];
            this.itemsToFill = [];
            this.pricelist = null;
          },
          err => {
              this.toastr.warning('You should choose free time interval for duration of price list!');
          }
        );
      }
    } else if (flag === 1) {
      this.toastr.warning('Please choose start and end date!');
    } else if (flag === 2) {
      this.toastr.warning('Please choose valid dates!');
    }
  }

  priceValidation(): boolean {
    for (const zoneItems of this.itemsToFill) {
      for (const item of zoneItems) {
        if (item.cost === undefined || item.cost.toString().length === 0 || isNaN(item.cost)) {
          return false;
        }
      }
    }
    return true;
  }

  getActive(): void {
    this.pricelistService.getActivePricelist().subscribe(
      response => {
        this.modifyingPricelist = response;
        const items = this.getAllItemsFromPricelist(this.modifyingPricelist);
        this.itemsToFill = this.separateItemsByZones(items);
      }
    );
  }

  getAllItemsFromPricelist(pricelist: Pricelist): Item[] {
    const items = [];
    for (const item of pricelist.items) {
      item.id = null;
      item.item.id = null;
      items.push(item.item);
    }
    return items;
  }

  saveModified(): void {
    if (!this.priceValidation()) {
      this.toastr.warning('All prices should be correctly inserted!');
    } else {
      this.pricelistService.update(this.modifyingPricelist, 'modify').subscribe(
        response => {
          this.toastr.success('Successfully changed pricelist');
          this.creating = false;
          this.modifying = false;
          this.choice = true;
          this.items = [];
          this.modifyingPricelist = null;
          this.itemsToFill = [];
        }
      );
    }
  }

}
