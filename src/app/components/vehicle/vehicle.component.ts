import { Component, OnInit } from '@angular/core';
import { VehicleService } from 'src/app/services/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { Vehicle, VehicleViewer, TransportLineIdentifier, VehicleSaver } from 'src/app/model/vehicle.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { TransportLineService } from 'src/app/services/transport-line.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  private vehicles: Vehicle[];
  private vehicleViewers: VehicleViewer[];
  private transportLines: TransportLine[];
  private filtredLinesByType: TransportLine[];

  // form attributes
  private formGroup: FormGroup;
  private isValidFormSubmitted: boolean;
  private vehicleEditForm: Vehicle; 

  constructor(private vehicleServic: VehicleService, 
    private transportLineServic: TransportLineService,
    private toastr: ToastrService) {
    this.vehicles = new Array<Vehicle>();
    this.vehicleViewers = new Array<VehicleViewer>();
    this.transportLines = new Array<TransportLine>();
    this.filtredLinesByType = new Array<TransportLine>();

    this.isValidFormSubmitted = null;
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      type: new FormControl(null, [Validators.required]),
      currentLine: new FormControl(null, [Validators.required])
    });

    this.vehicleEditForm = null;
   }

  ngOnInit() {
    // fetch all vehicles
    this.vehicleServic.findAll().subscribe(response => {
      this.vehicles = response;
      let tempThis = this;
      this.vehicles.forEach(function (vehicle:Vehicle) {
        tempThis.vehicleViewers.push(new VehicleViewer(vehicle, false));
      });
    });
    
    // fetch all transport lines
    this.transportLineServic.findAll().subscribe(response => {
      this.transportLines = response;
      this.filtredLinesByType = response;
    });
  }

  onTypeChange(vehicleType: string): void {
      this.filtredLinesByType = this.transportLines
      .filter(transportLine => transportLine.type == vehicleType);
      if (this.filtredLinesByType.length){
        this.currentLine.setValue(this.filtredLinesByType[0]);
      }
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
    this.vehicleServic.create(
      new VehicleSaver(null, this.name.value, this.type.value, currentLine))
         .subscribe(result => {
            this.vehicles.push(result);
            this.vehicleViewers.push(new VehicleViewer(result, false));
            this.toastr.success("Vehicle successfully saved!");
         });
    this.formGroup.reset();
 }

 deleteVehicle(id: number): void{
   for (let index = 0; index < this.vehicles.length; index++) {
     const vehicle = this.vehicles[index];
     if (vehicle.id == id){
      this.vehicleServic.remove(id, index, this.vehicles, this.vehicleViewers);
      return;
    }
   }
 }

 get name() {
  return this.formGroup.get("name");
 }

 get type() {
  return this.formGroup.get("type");
 }

 get currentLine() {
  return this.formGroup.get("currentLine");
 }

}
