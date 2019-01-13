import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Vehicle, VehicleSaver } from 'src/app/model/vehicle.model';
import { TransportLine } from 'src/app/model/transport-line.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';

/**
 * Provides vehicles management
 *
 * @export
 */
@Component({
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  private vehicles: Vehicle[];
  private transportLines: TransportLine[];
  public filtredLinesByType: TransportLine[];

  // image paths
  public busImage = 'src/assets/img/bus.jpg';
  public metroImage = 'src/assets/img/metro.jpg';
  public tramImage = 'src/assets/img/tram.jpg';
  public addImage = 'src/assets/img/addVehicle.png';

  // form attributes
  private modalForm: NgbModalRef;
  public isValidFormSubmitted: boolean;
  public headerName: string;
  public formGroup: FormGroup;

  @ViewChild('content') modalFormElement: ElementRef;

  /**
   * Creates an instance of VehicleComponent.
   * @param VehicleService vehicleService REST service for vehicle
   * @param TransportLineService transportLineService REST service for transport line
   * @param ToastrService toastrService user notification service
   * @param NgbModal modalService modal form service
   */
  constructor(private vehicleService: VehicleService,
    private transportLineService: TransportLineService,
    private toastrService: ToastrService,
    private modalService: NgbModal) {
    this.vehicles = new Array<Vehicle>();
    this.transportLines = new Array<TransportLine>();
    this.filtredLinesByType = [null];

    this.isValidFormSubmitted = null;
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required,
      Validators.minLength(3), Validators.maxLength(30)]),
      type: new FormControl(null, [Validators.required]),
      currentLine: new FormControl(null, []),
      id: new FormControl(null, [])
    });
    this.headerName = 'Create Vehicle';
  }

  /**
   * Fetchs transport line and vehicle data
   */
  ngOnInit() {
    // fetch all vehicles
    this.vehicleService.findAll().subscribe(
      response => this.vehicles = response,
      err => this.toastrService.error(err));

    // fetch all transport lines
    this.transportLineService.findAll().subscribe(response => {
      this.transportLines = response;
      this.filtredLinesByType.push(...response);
    }, err => this.toastrService.error(err));
  }

  /**
   * Provides delete option for vehicle
   *
   * @param number id target vehicle id
   */
  deleteVehicle(id: number): void {
    for (let index = 0; index < this.vehicles.length; index++) {
      const vehicle = this.vehicles[index];
      if (vehicle.id === id) {
        this.vehicleService.remove(id, index, this.vehicles);
        return;
      }
    }
  }

  /**
   * Provides edit option for vehicle
   *
   * @param number id target vehicle id
   * @param any content modal form content
   */
  editVehicle(id: number, content: any): void {
    const vehicle = this.vehicles.find(v => v.id === id);
    this.name.setValue(vehicle.name);
    this.type.setValue(vehicle.vehicleType);
    this.currentLine.setValue(null);
    this.onTypeChange(vehicle.vehicleType);
    this.id.setValue(id);

    this.headerName = 'Edit Vehicle';
    this.open(content);
  }

  /**
   * Opens modal form for vehicle
   *
   * @param any content modal form content
   */
  open(content: any): void {
    this.modalForm = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  /**
   * Submits modal form and update vehicle changes
   */
  onFormSubmit(): void {
    this.isValidFormSubmitted = false;
    if (this.formGroup.invalid) {
      return;
    }
    this.isValidFormSubmitted = true;
    let currentLine = this.currentLine.value;
    if (currentLine !== null) {
      currentLine = currentLine.id;
    }
    this.vehicleService.create(
      { id: this.id.value, name: this.name.value, vehicleType: this.type.value, currentLine: currentLine, active: true})
      .subscribe(result => {
        const vehicle: Vehicle = result as Vehicle;
        if (vehicle.id !== this.id.value) {
          this.vehicles.push(result);
        } else {
          const index: number = this.vehicles.findIndex(v => v.id === vehicle.id);
          this.vehicles[index] = vehicle;
        }
        this.id.setValue(null);
        this.modalForm.close();
        this.toastrService.success('Vehicle successfully saved!');
        this.formGroup.reset();
      }, err => this.toastrService.error(err));
  }

  /**
   * Filters available transport line by type in
   * type select box
   *
   * @param string vehicleType target type of transport lines
   */
  onTypeChange(vehicleType: string): void {
    this.filtredLinesByType = this.transportLines
      .filter(transportLine => transportLine.vehicleType === vehicleType);
    this.filtredLinesByType.unshift(null);
  }

  private get name() {
    return this.formGroup.get('name');
  }

  private get type() {
    return this.formGroup.get('type');
  }

  private get currentLine() {
    return this.formGroup.get('currentLine');
  }

  private get id() {
    return this.formGroup.get('id');
  }
}
