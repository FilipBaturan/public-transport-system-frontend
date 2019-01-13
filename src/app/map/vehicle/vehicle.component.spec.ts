import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { VehicleComponent } from './vehicle.component';
import { VehicleService } from 'src/app/core/services/vehicle.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('VehicleComponent', () => {
  let component: VehicleComponent;
  let fixture: ComponentFixture<VehicleComponent>;

  let mockVehicleService: any;
  let mockTransportLineService: any;
  let mockToastrService: any;
  let mockModalService: any;

  beforeEach(async(() => {
    mockVehicleService = jasmine.createSpyObj(['']);
    mockTransportLineService = jasmine.createSpyObj(['']);
    mockToastrService = jasmine.createSpyObj(['']);
    mockModalService = jasmine.createSpyObj(['']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        VehicleComponent,
        FakeNavBarComponent
      ],
      providers: [
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: TransportLineService, useValue: mockTransportLineService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: NgbModal, useValue: mockModalService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
