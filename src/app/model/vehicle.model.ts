import { VehicleType } from './enums/vehicle-type.model';

export interface Vehicle {
    id: number;
    name: string;
    type: VehicleType;
    currentLine: TransportLineIdentifier;
}

export interface TransportLineIdentifier {
    id: number;
    name: string;
}

export interface VehicleSaver {
    id: number;
    name: string;
    type: VehicleType;
    currentLine: number;
    active: boolean;
}

export interface TrackedVehicle {
    id: number;
    name: string;
    vehicleType: VehicleType;
    latitude: number;
    longitude: number;
    active: boolean;
}
