import { TestBed, fakeAsync } from '@angular/core/testing';
import { TicketService } from './ticket.service';
import { User } from '../../model/users/user.model';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { Ticket } from 'src/app/model/ticket/ticket';

describe('TicketService', () => {

  const url: string = '/api/ticket';
  let dbTickets: Ticket[];

  let mockToastrService: any;
  let mockHttp: HttpTestingController;
  let service: TicketService;

  let userId : number = 1;
  let ticketToDeny = new Ticket(1, true, "2018-01-01", "2018-12-12");


  beforeEach(() => {
    
    dbTickets = [
      new Ticket(1, true, "2018-01-01", "2018-12-12"),
      new Ticket(1, true, "2018-02-04", "2018-06-30"),
      new Ticket(1, true, "2018-07-13", "2018-07-15"),
      new Ticket(1, true, "2018-10-21", "2018-11-06"),
    ];

    mockToastrService = jasmine.createSpyObj(['success', 'error']);
    
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ToastrService, useValue: mockToastrService }
      ]
    });

    mockHttp = TestBed.get(HttpTestingController);
    service = TestBed.get(TicketService);
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //Get tickets for user test
  it('should get all available users', fakeAsync(() => {
    service.getTicketsForUser(userId).subscribe(tickets => {
      expect(tickets.length).toBe(dbTickets.length);
      expect(tickets[0]).toEqual(dbTickets[0]);
      expect(tickets[1]).toEqual(dbTickets[1]);
      expect(tickets[2]).toEqual(dbTickets[2]);
      expect(tickets[3]).toEqual(dbTickets[3]);
    });

    const req = mockHttp.expectOne(url + "/getTicketsForUser/" + userId + "/");
    expect(req.request.method).toBe('GET');
    req.flush(dbTickets);
  }));

  it('should receive client side error', fakeAsync(() => {
    service.getTicketsForUser(userId).subscribe(() => { }, err => {
      expect(err).toBe('Client side error!');
    });

    const req = mockHttp.expectOne(url + "/getTicketsForUser/" + userId + "/");
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  }));

  it('should receive server is down error', fakeAsync(() => {
    service.getTicketsForUser(userId).subscribe(() => { }, err => {
      expect(err).toBe('Server is down!');
    });

    const req = mockHttp.expectOne(url + "/getTicketsForUser/" + userId + "/");
    expect(req.request.method).toBe('GET');
    req.flush("Error occured", { status: 401, statusText: 'Unathorized' });
  }));

  it('should receive unathorized error', fakeAsync(() => {
    service.getTicketsForUser(userId).subscribe(() => { }, err => {
      expect(err).toBe("Unathorized");
    });

    const req = mockHttp.expectOne(url + "/getTicketsForUser/" + userId + "/");
    expect(req.request.method).toBe('GET');
    req.flush("Unathorized", { status: 403, statusText: 'Unathorized' });
  }));

  it('should receive date type error', fakeAsync(() => {
    service.getTicketsForUser(userId).subscribe(() => { }, err => {
      expect(err).toBe('Date type is not valid!');
    });

    const req = mockHttp.expectOne(url + "/getTicketsForUser/" + userId + "/");
    expect(req.request.method).toBe('GET');
    req.flush({ message: 'Date type is not valid!' },
      { status: 400, statusText: 'Bad Request' });
  }));

  it('should deny given ticket', fakeAsync(() => {
    service.denyTicket(ticketToDeny).subscribe(ticket => {
      expect(ticket).toBe(ticketToDeny);
    });

    const req = mockHttp.expectOne(url + "/updateTicket/");
    expect(req.request.method).toBe('PUT');
    req.flush(ticketToDeny);
  }));

});
