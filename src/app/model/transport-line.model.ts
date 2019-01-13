import { TransportLinePosition } from './position.model';
import { VehicleType } from './enums/vehicle-type.model';

export interface TransportLine {
    id: number;
    name: string;
    schedule: number[];
    positions: TransportLinePosition;
    active: boolean;
    vehicleType: VehicleType;
    zone: number;
}

export interface TransportLineViewer extends TransportLine {
    visible: boolean;
}

export interface TransportLineCollection {
    transportLines: TransportLine[];
}
