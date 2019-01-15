import { VehicleType } from './enums/vehicle-type.model';

export interface Zone {
    id: number;
    name: string;
    lines: ZoneTransportLine[];
    active: boolean;
}

export interface ZoneTransportLine {
    id: number;
    name: string;
    type: VehicleType;
    active: boolean;
}
