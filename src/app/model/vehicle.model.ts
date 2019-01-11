import { VehicleType } from './enums/vehicle-type.model';

export interface Vehicle {
    id: number;
    name: string;
    vehicleType: VehicleType;
    currentLine: TransportLineIdentifier;
}

export interface TransportLineIdentifier {
    id: number;
    name: string;
}

export interface VehicleSaver {
    id: number;
    name: string;
    vehicleType: VehicleType;
    currentLine: number;
    active: boolean;
}
