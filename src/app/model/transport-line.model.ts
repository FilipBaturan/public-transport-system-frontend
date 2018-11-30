import { TransportLinePosition } from "./position.model";
import { Schedule } from "./schedule.model";

export class TransportLine {
    
    id: number;
    name: string;
    positions: TransportLinePosition[];
    schedule: Schedule[];
    active: boolean;
    type : string;
    zone: number;
    color: string;
    width: string;

    constructor(id: number, name: string, positions: TransportLinePosition[], schedule: Schedule[],
        active: boolean, type: string,zone: number, color: string, width: string){
            this.id = id;
            this.name = name;
            this.positions = positions;
            this.schedule = schedule;
            this.active = active;
            this.type = type;
            this.zone = zone;
            this.color = color;
            this.width = width;
        }  
    
}