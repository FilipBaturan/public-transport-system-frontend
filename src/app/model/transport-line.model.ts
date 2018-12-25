import { TransportLinePosition } from "./position.model";

export class TransportLine {
    
    id: number;
    name: string;
    schedule: number[];
    positions: TransportLinePosition;
    active: boolean;
    type : string;
    zone: number;

    constructor(id: number, name: string, positions: TransportLinePosition, schedule: number[],
        active: boolean, type: string, zone: number){
            this.id = id;
            this.name = name;
            this.positions = positions;
            this.schedule = schedule;
            this.active = active;
            this.type = type;
            this.zone = zone;
        }  
        
}

export class TransportLineViewer extends TransportLine {
    
    visible: boolean;

    constructor(id: number, name: string, positions: TransportLinePosition, schedule: number[],
        active: boolean, type: string, zone: number, visible: boolean){
            super(id, name, positions, schedule, active, type, zone);
            this.visible = visible;
        }
}

export class TransportLineCollection {

    transportLines: TransportLine[];

    constructor(transportLines: TransportLine[]) {
        this.transportLines = transportLines;
    }
}
