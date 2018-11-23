import { Station } from "./station.model";

export class TransportLine {
    id: number;

    name: string;

    stations: Station[];

    schedule: number[];
    
    active: boolean;

    type : string;
    
    zone: number;
}