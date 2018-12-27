import { PricelistItem } from "./pricelistItem.model";

export class Pricelist{
    id: number;
    startDate: Date;
    endDate: Date;
    items: PricelistItem[];
}