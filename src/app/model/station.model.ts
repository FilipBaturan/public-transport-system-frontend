import { StationPosition } from './position.model';
import { VehicleType } from './enums/vehicle-type.model';

export interface Station {
    id: number;
    name: string;
    position: StationPosition;
    type: VehicleType;
    active: boolean;
}

export interface StationCollection {
    stations: Station[];
}
