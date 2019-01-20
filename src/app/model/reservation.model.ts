import { Ticket } from './ticket.model';


export interface Reservation {
    id: number;
    tickets: Ticket[];
    owner: number;

}
