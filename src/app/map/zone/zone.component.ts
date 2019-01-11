// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { FormGroup, FormControl, Validators } from '@angular/forms';

// import { ToastrService } from 'ngx-toastr';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// import { Zone, ZoneTransportLine } from 'src/app/model/zone.model';
// import { ZoneService } from 'src/app/core/services/zone.service';

// /**
//  * Provides zone managment
//  *
//  * @export
//  * @class ZoneComponent
//  * @implements {OnInit}
//  */
// @Component({
//   templateUrl: './zone.component.html',
//   styleUrls: ['./zone.component.css']
// })
// export class ZoneComponent implements OnInit {

//   public isCollapsed: boolean;
//   public isValidFormSubmitted: boolean;
//   public headerName: string;
//   public addImage: string = "src/assets/img/addZone.png";

//   private zones: Zone[];
//   private selectedZoneLines: ZoneTransportLine[];
//   private availableLines: ZoneTransportLine[];

//   // form attributes
//   private modalForm: NgbModalRef;
//   public formGroup: FormGroup;

//   @ViewChild("content") modalFormElement: ElementRef;

//   /**
//    * Creates an instance of ZoneComponent.
//    * @param {ZoneService} zoneService REST service for zones
//    * @param {ToastrService} toastrService user notification service
//    * @param {NgbModal} modalService modal form service
//    * @memberof ZoneComponent
//    */
//   constructor(private zoneService: ZoneService,
//     private toastrService: ToastrService,
//     private modalService: NgbModal) {
//     this.zones = new Array<Zone>();

//     this.isValidFormSubmitted = null;
//     this.isCollapsed = false;
//     this.formGroup = new FormGroup({
//       name: new FormControl('', [Validators.required,
//       Validators.minLength(1), Validators.maxLength(30)]),
//       id: new FormControl(null, [])
//     });
//     this.headerName = "Create Zone";
//   }

//   /**
//    * Fetchs zone data
//    *
//    * @memberof ZoneComponent
//    */
//   ngOnInit() {
//     // fetch all zones
//     this.zoneService.findAll().subscribe(
//       response => this.zones = response,
//       err => this.toastrService.error(err));
//   }

//   /**
//    * Adds transport line to selected zone
//    * for editing
//    *
//    * @param {number} id target transport line id
//    * @param {*} content modal form content
//    * @memberof ZoneComponent
//    */
//   addLine(id: number, content: any): void {
//     this.selectedZoneLines.push(this.availableLines.find(line => line.id == id));
//     this.availableLines = this.availableLines.filter(line => line.id != id);
//     this.modalForm.close();
//     this.open(content);
//   }

//   /**
//    * Provides create option for zone
//    *
//    * @param {*} content modal form content
//    * @memberof ZoneComponent
//    */
//   create(content: any): void {
//     this.id.setValue(null);
//     this.selectedZoneLines = new Array<ZoneTransportLine>();
//     this.filterAvailableLines();
//     this.open(content);
//   }

//   /**
//    * Provides delete option for zone
//    *
//    * @param {number} id target zone id
//    * @memberof ZoneComponent
//    */
//   deleteZone(id: number): void {
//     this.zoneService.remove(id, this.zones);
//   }

//   /**
//    * Provides edit option for zone
//    *
//    * @param {number} id target zone id
//    * @param {*} content modal form content
//    * @memberof ZoneComponent
//    */
//   editZone(id: number, content: any): void {
//     this.headerName = "Edit Zone";
//     let zone: Zone = this.zones.find(z => z.id == id);
//     this.id.setValue(zone.id);
//     this.name.setValue(zone.name)
//     let tempThis = this;
//     this.selectedZoneLines = new Array<ZoneTransportLine>();
//     zone.lines.forEach(line => tempThis.selectedZoneLines
//       .push(new ZoneTransportLine(line.id, line.name, line.vehicleType, line.active)));
//     this.filterAvailableLines();
//     this.open(content);
//   }

//   /**
//    * Filters zones that are not in selected
//    * zone for editing
//    *
//    * @memberof ZoneComponent
//    */
//   filterAvailableLines(): void {
//     this.availableLines = [];
//     for (const zone of this.zones) {
//       if (zone.id == 1) {
//         for (const line of zone.lines) {
//           if (!this.selectedZoneLines.find(l => l.id == line.id)
//             && !this.availableLines.find(l => l.id == line.id)) {
//             this.availableLines.push(line);
//           }
//         }
//       }
//     }
//   }

//   /**
//    * Submits modal form and update zone changes
//    *
//    * @returns {void}
//    * @memberof ZoneComponent
//    */
//   onFormSubmit(): void {
//     this.isValidFormSubmitted = false;
//     if (this.formGroup.invalid) {
//       return;
//     }
//     this.isValidFormSubmitted = true;

//     this.zoneService.create(new Zone(this.id.value, this.name.value, this.selectedZoneLines, true))
//       .subscribe(() => {
//         this.zoneService.findAll().subscribe(result => this.zones = result);
//         this.modalForm.close();
//         this.toastrService.success("Zone successfully saved!");
//         this.formGroup.reset();
//       }, err =>
//           err.status == 403 ? this.toastrService.error("Forbidden!") : this.toastrService.error(err.error));
//   }

//   /**
//    * Opens modal form for zone
//    *
//    * @param {*} content modal form content
//    * @memberof ZoneComponent
//    */
//   open(content: any): void {
//     this.modalForm = this.modalService.open(content,
//       { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
//   }

//   /**
//    * Removes transport line from selected zone
//    * for editing
//    *
//    * @param {number} id target transport line id
//    * @param {*} content modal fomr content
//    * @memberof ZoneComponent
//    */
//   removeLine(id: number, content: any): void {
//     this.availableLines.push(this.selectedZoneLines.find(line => line.id == id));
//     this.selectedZoneLines = this.selectedZoneLines.filter(line => line.id != id);
//     this.modalForm.close();
//     this.open(content);
//   }

//   private get name() {
//     return this.formGroup.get("name");
//   }

//   private get id() {
//     return this.formGroup.get("id");
//   }
// }
