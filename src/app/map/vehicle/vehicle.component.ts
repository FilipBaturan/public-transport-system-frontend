import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Vehicle, VehicleSaver } from 'src/app/model/vehicle.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';

@Component({
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  private vehicles: Vehicle[];
  private transportLines: TransportLine[];
  private filtredLinesByType: TransportLine[];

  // form attributes
  private formGroup: FormGroup;
  private isValidFormSubmitted: boolean;
  private headerName: string;
  private modalForm: NgbModalRef;

  constructor(private vehicleService: VehicleService, 
    private transportLineServic: TransportLineService,
    private toastr: ToastrService,
    private modalService: NgbModal) {
    this.vehicles = new Array<Vehicle>();
    this.transportLines = new Array<TransportLine>();
    this.filtredLinesByType = new Array<TransportLine>();

    this.isValidFormSubmitted = null;
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, 
        Validators.minLength(3), Validators.maxLength(30)]),
      type: new FormControl(null, [Validators.required]),
      currentLine: new FormControl(null, []),
      id: new FormControl(null, [])
    });
    this.headerName = "Create Vehicle";
   }

  ngOnInit() {
    // fetch all vehicles
    this.vehicleService.findAll().subscribe(response => this.vehicles = response);
    
    // fetch all transport lines
    this.transportLineServic.findAll().subscribe(response => {
      this.transportLines = response;
      this.filtredLinesByType = response;
    });
  }

  open(content: any) {
    this.modalForm = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  onTypeChange(vehicleType: string): void {
      this.filtredLinesByType = this.transportLines
      .filter(transportLine => transportLine.type == vehicleType);
      if (this.filtredLinesByType.length){
        this.currentLine.setValue(this.filtredLinesByType[0]);
      }
  }

  editVehicle(id: number, content: any){
    let vehicle = this.vehicles.find(vehicle => vehicle.id == id);
    this.name.setValue(vehicle.name);
    this.type.setValue(vehicle.type);
    this.currentLine.setValue(vehicle.currentLine);
    this.id.setValue(id);

    this.headerName = "Edit Vehicle";
    this.open(content);
  }

  onFormSubmit(): void {
    this.isValidFormSubmitted = false;
    if (this.formGroup.invalid) {
       return;
    }
    this.isValidFormSubmitted = true;
    let currentLine =  this.currentLine.value;
    if (currentLine !== null){
      currentLine = currentLine.id
    }
    this.vehicleService.create(
      new VehicleSaver(this.id.value, this.name.value, this.type.value, currentLine))
         .subscribe(result=> {
            let vehicle: Vehicle = result as Vehicle;
            if(vehicle.id != this.id.value){
              this.vehicles.push(result);
            }else{
              let index: number = this.vehicles.findIndex(v => v.id == vehicle.id);
              this.vehicles[index] = vehicle;
            }
            this.id.setValue(null);
            this.modalForm.close();
            this.toastr.success("Vehicle successfully saved!");
            this.formGroup.reset();
         });
 }

 deleteVehicle(id: number): void {
   for (let index = 0; index < this.vehicles.length; index++) {
     const vehicle = this.vehicles[index];
     if (vehicle.id == id){
      this.vehicleService.remove(id, index, this.vehicles);
      return;
    }
   }
 }

 private get name() {
  return this.formGroup.get("name");
 }

 private get type() {
  return this.formGroup.get("type");
 }

 private get currentLine() {
  return this.formGroup.get("currentLine");
 }

 private get id () {
  return this.formGroup.get("id");
 }
}
