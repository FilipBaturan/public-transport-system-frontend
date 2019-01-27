import { PricelistItem } from './pricelistItem.model';

export interface Pricelist {
    id: number;
    startDate: Date;
    endDate: Date;
    items: PricelistItem[];
}
