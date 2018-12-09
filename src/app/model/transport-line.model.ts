import { TransportLinePosition } from "./position.model";
import { Schedule } from "./schedule.model";
import { Zone } from "./zone.model"

export class TransportLine {
    
    id: number;
    name: string;
    schedule: Schedule;
    positions: TransportLinePosition;
    active: boolean;
    type : string;
    zone: number;

    constructor(id: number, name: string, positions: TransportLinePosition, schedule: Schedule,
        active: boolean, type: string,zone: number){
            this.id = id;
            this.name = name;
            this.positions = positions;
            this.schedule = schedule;
            this.active = active;
            this.type = type;
            this.zone = zone;
        }  
        
}