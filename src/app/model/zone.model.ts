import { VehicleType } from "./enums/vehicle-type.model";

export class Zone {

    id: number;
    name: string;
    lines: ZoneTransportLine[];
    active: boolean;

    constructor(id: number, name: string, lines: ZoneTransportLine[], active: boolean) {
        this.id = id;
        this.name = name;
        this.lines = lines;
        this.active = active;
    }
}

export class ZoneTransportLine {
    
    id: number;
    name: string;
    type: VehicleType;
    active: boolean;

    constructor(id: number, name:string, type: VehicleType, active: boolean) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.active = active;
    }
}