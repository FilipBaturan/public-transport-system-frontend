import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserTicketsComponent } from './user-tickets.component';
import { Ticket } from '../../model/ticket/ticket';
import { asyncScheduler, of, throwError } from 'rxjs';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatCheckboxModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatToolbarModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { TicketService } from '../../core/services/ticket.service';
import { ToastrService } from 'ngx-toastr';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';


@Component({
  selector: 'app-nav-bar',
  template: '<div></div>',
})
class FakeNavBarComponent {

  public mapCollapsed = true;
  public accCollapsed = true;

  constructor() { }

}

describe('UserTicketsComponent', () => {
  let component: UserTicketsComponent;
  let fixture: ComponentFixture<UserTicketsComponent>;

  let mockTicketService: any;
  let mockToastrService: any;

  let dbTickets : Ticket[];
  let error: boolean;
  let errorDeny: boolean;

  beforeEach(fakeAsync(() => {

    error = false;
    errorDeny = false;

    dbTickets = [
      {id: 1, active: true, purchaseDate: "2018-01-01", expiryDate: "2018-12-12"},
      {id: 2, active: true, purchaseDate: "2018-02-04", expiryDate: "2018-06-30"},
      {id: 3, active: true, purchaseDate: "2018-07-13", expiryDate: "2018-07-15"},
      {id: 4, active: true, purchaseDate: "2018-10-21", expiryDate: "2018-11-06"},
    ]

    mockTicketService = {
      getTicketsForUser() {
        if (error) {
          return throwError({ status: 400 }, asyncScheduler);
        }else {
          return of(dbTickets, asyncScheduler);
        }
      },
      denyTicket() {
        if (errorDeny) {
          return throwError({ status: 404 }, asyncScheduler);
        }else {
          return of(dbTickets, asyncScheduler);
        }
      }
    }

    spyOn(mockTicketService, 'getTicketsForUser').and.callThrough();
    spyOn(mockTicketService, 'denyTicket').and.callThrough();
   
    
    mockToastrService = jasmine.createSpyObj(['success', 'error', 'info']);


    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        HttpClientModule,
        RouterTestingModule
      ],
      declarations: [ UserTicketsComponent, FakeNavBarComponent ],
      providers: [
        { provide: TicketService, useValue: mockTicketService },
        { provide: ToastrService, useValue: mockToastrService }
      ],
      schemas:[NO_ERRORS_SCHEMA]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTicketsComponent);
    component = fixture.componentInstance;

  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
    expect(mockTicketService.getTicketsForUser).toHaveBeenCalled();
  }));


  it('should not get tickets for user', fakeAsync(() => {
    error = true
    fixture.detectChanges();
    tick();
    expect(mockTicketService.getTicketsForUser).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();
  }));

  it('should deny ticket', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.denyTicket(dbTickets[1]);

    tick();
    fixture.detectChanges();

    expect(mockTicketService.getTicketsForUser).toHaveBeenCalled();
    expect(mockTicketService.denyTicket).toHaveBeenCalled();

  }));

  it('should NOT deny ticket', fakeAsync(() => {
    errorDeny = true;
    fixture.detectChanges();
    tick();

    component.denyTicket(dbTickets[1]);

    tick();
    fixture.detectChanges();

    expect(mockTicketService.getTicketsForUser).toHaveBeenCalled();
    expect(mockTicketService.denyTicket).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalled();

  }));


});
