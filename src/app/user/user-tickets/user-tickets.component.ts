import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../model/ticket/ticket';
import { ToastrService } from 'ngx-toastr';
import { TicketService } from 'src/app/core/services/ticket.service';

@Component({
  selector: 'app-user-tickets',
  templateUrl: './user-tickets.component.html',
  styleUrls: ['./user-tickets.component.css']
})
export class UserTicketsComponent implements OnInit {

  displayedColumns: string[] = ['purchaseDate', 'expiryDate', 'deny'];

  tickets: Ticket[] = [];

  constructor(private route: ActivatedRoute, private ticketService: TicketService, 
    private toastr: ToastrService) { }

  ngOnInit() {
    let id = +this.route.snapshot.paramMap.get('id');

    this.ticketService.getTicketsForUser(id).subscribe(
      response => this.tickets = response),
      (err) => this.toastr.error(err);
  }

  
  denyTicket(t: Ticket){
    t.active = false;

    this.ticketService.denyTicket(t).subscribe(
      response => {
        if (response == true)
        {
          this.toastr.info("Succesfully denied ticket");
          var index = this.tickets.indexOf(t);
          const copiedData =  this.tickets.slice();
          copiedData.splice(index, 1);
          this.tickets = copiedData;
        }
        else
          this.toastr.error("Could not find ticket you want to deny");
    },
    (err) => this.toastr.error("Ticket denial failed"))
  }

}
