import { StationPosition } from "./position.model";
import { VehicleType } from "./enums/vehicle.enum";

export class Station {

    id: number;
    name: string; 
    position: StationPosition;
    type: VehicleType;
    active: boolean;

    constructor(id: number, name: string, position: StationPosition, type: VehicleType,
         active: boolean) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.type = type;
        this.active = active;
    }
}

export class StationCollection {

    stations: Station[];

    constructor(stations: Station[]) {
        this.stations = stations;
    }
}