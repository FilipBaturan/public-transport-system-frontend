import { Coordinates } from "./coordinates.model";

export class Station{

    id: number;
    name: string; 
    coordinates: Coordinates;
    acitve: boolean;

    constructor(id: number, name: string, coordinates: Coordinates, active: boolean) {
        this.id = id;
        this.name = name;
        this.coordinates = coordinates;
        this.acitve = this.acitve;
    }
}