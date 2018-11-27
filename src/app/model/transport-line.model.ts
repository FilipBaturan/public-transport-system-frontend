import { Station } from "./station.model";

export class TransportLine {
    
    id: number;
    name: string;
    stations: Station[];
    schedule: number[];
    active: boolean;
    type : string;
    zone: number;

    constructor(id: number, name: string, stations: Station[], schedule: number[],
        active: boolean, type: string,zone: number){
            this.id = id;
            this.name = name;
            this.stations = stations;
            this.schedule = schedule;
            this.active = active;
            this.type = type;
            this.zone = zone;
        }  
}