import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MapComponent } from './map.component';
import { UserService } from 'src/app/core/services/user.service';
import { StationService } from 'src/app/core/services/station.service';
import { TransportLineService } from 'src/app/core/services/transport-line.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from 'src/app/core/services/map.service';



@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  // mocks of services
  let mockUserService: any;
  let mockStationService: any;
  let mockTransportLineService: any;
  let mockToastrService: any;
  let mockModalService: any;
  let mockMapService: any;

  beforeEach(async(() => {
    mockUserService = jasmine.createSpyObj(['']);
    mockStationService = jasmine.createSpyObj(['']);
    mockTransportLineService = jasmine.createSpyObj(['']);
    mockToastrService = jasmine.createSpyObj(['']);
    mockModalService = jasmine.createSpyObj(['']);
    mockMapService = jasmine.createSpyObj(['']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [
        MapComponent,
        FakeNavBarComponent
      ],
      providers: [
        {provide: UserService, useValue: mockUserService},
        {provide: StationService, useValue: mockStationService},
        {provide: TransportLineService, useValue: mockTransportLineService},
        {provide: ToastrService, useValue: mockToastrService},
        {provide: NgbModal, useValue: mockModalService},
        {provide: MapService, useValue: mockMapService}
      ]

    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
