import { Component, OnInit } from '@angular/core';
import { ZoneService } from 'src/app/services/zone.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Zone, ZoneTransportLine } from 'src/app/model/zone.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.css']
})
export class ZoneComponent implements OnInit {

  private zones: Zone[];
  private selectedZoneLines: ZoneTransportLine[];
  private availableLines: ZoneTransportLine[];

  // form attributes
  private formGroup: FormGroup;
  private isValidFormSubmitted: boolean;
  private headerName: string;
  private modalForm: NgbModalRef;

  constructor(private zoneService: ZoneService,
    private toastr: ToastrService,
    private modalService: NgbModal) {
      this.zones = new Array<Zone>();

      this.isValidFormSubmitted = null;
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required,
         Validators.minLength(1), Validators.maxLength(30)]),
      id: new FormControl(null, [])
    });
    this.headerName = "Create Zone";
    }

  ngOnInit() {
    // fetch all vehicles
    this.zoneService.findAll().subscribe(response => this.zones = response);
  }

  create(content: any){
    this.id.setValue(null);
    this.selectedZoneLines = new Array<ZoneTransportLine>();
    this.filterAvailableLines();
    this.open(content);
  }

  editZone(id: number, content: any){
    this.headerName = "Edit Zone";
    let zone: Zone = this.zones.find(z => z.id == id);
    this.id.setValue(zone.id);
    this.name.setValue(zone.name)
    let tempThis = this;
    this.selectedZoneLines = new Array<ZoneTransportLine>();
    zone.lines.forEach(line => tempThis.selectedZoneLines
      .push(new ZoneTransportLine(line.id, line.name, line.vehicleType, line.active)));
    this.filterAvailableLines();
    this.open(content);
  }

  open(content: any) {
    this.modalForm = this.modalService.open(content, 
      {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  addLine(id: number, content:any){
    this.selectedZoneLines.push(this.availableLines.find(line => line.id == id));
    this.availableLines = this.availableLines.filter( line => line.id != id);
    this.modalForm.close();
    this.open(content);
  }

  removeLine(id: number, content:any){
    this.availableLines.push(this.selectedZoneLines.find(line => line.id == id));
    this.selectedZoneLines = this.selectedZoneLines.filter(line => line.id != id);
    this.modalForm.close();
    this.open(content);
  }

  filterAvailableLines(): void {
    this.availableLines = [];
    for (const zone of this.zones) {
      if (zone.id == 1) {
        for (const line of zone.lines) {
          if (!this.selectedZoneLines.find(l => l.id == line.id) 
          && !this.availableLines.find(l => l.id == line.id)){
            this.availableLines.push(line);
          }
        }  
      }
    }
  }

  onFormSubmit(): void {
    this.isValidFormSubmitted = false;
    if (this.formGroup.invalid) {
       return;
    }
    this.isValidFormSubmitted = true;
    
    this.zoneService.create(new Zone(this.id.value, this.name.value, this.selectedZoneLines, true))
    .subscribe(() => {
      this.zoneService.findAll().subscribe(result => this.zones = result);
      this.modalForm.close();
      this.toastr.success("Vehicle successfully saved!");
      this.formGroup.reset();
    });
  }

  deleteZone(id: number): void {
    this.zoneService.remove(id, this.zones);
  }

  private get name() {
    return this.formGroup.get("name");
   }
  
   private get id () {
    return this.formGroup.get("id");
   }

}
