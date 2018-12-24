import { Ticket } from "./ticket.model";


export class Reservation{
    id: number;
    tickets: Ticket[];
    owner: number;

    constructor(id: number, tickets: Ticket[], owner: number){
        this.id = id;
        this.tickets = tickets;
        this.owner = owner;
    }
}