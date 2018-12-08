export class Ticket {

    id: number;
    active: boolean;
    purchaseDate: string;
    expiryDate: string;

    constructor(id: number, active: boolean, purchaseDate: string, expiryDate: string){
        this.id = id;
        this.active = active;
        this.purchaseDate = purchaseDate;
        this.expiryDate = expiryDate;
    }

}