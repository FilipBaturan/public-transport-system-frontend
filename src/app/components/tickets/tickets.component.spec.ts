import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TicketsComponent } from './tickets.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { ZoneService } from 'src/app/core/services/zone.service';
import { PricelistService } from 'src/app/core/services/pricelist.service';
import { ReservationService } from 'src/app/core/services/reservation.service';


@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;

  let mockAuthService: any;
  let mockZoneService: any;
  let mockPriceListService: any;
  let mockReservationService: any;

  beforeEach(async(() => {
    mockAuthService = jasmine.createSpyObj(['']);
    mockZoneService = jasmine.createSpyObj(['']);
    mockPriceListService = jasmine.createSpyObj(['']);
    mockReservationService = jasmine.createSpyObj(['']);

    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        TicketsComponent,
        FakeNavBarComponent
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ZoneService, useValue: mockZoneService },
        { provide: PricelistService, useValue: mockPriceListService },
        { provide: ReservationService, useValue: mockReservationService }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
