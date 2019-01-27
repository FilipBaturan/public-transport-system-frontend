export class Ticket {
    id: number;
    purchaseDate: Date;
    line: number;
    pricelistitem: number;
    ticketType: string;

    constructor(purchaseDate: Date, line: number, pricelistitem: number, type: string) {
        this.pricelistitem = pricelistitem;
        this.purchaseDate = purchaseDate;
        this.line = line;
        this.ticketType = type;
    }
}
