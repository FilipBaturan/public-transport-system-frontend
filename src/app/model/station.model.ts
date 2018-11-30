import { StationPosition } from "./position.model";

export class Station{

    id: number;
    name: string; 
    position: StationPosition;
    acitve: boolean;

    constructor(id: number, name: string, position: StationPosition, active: boolean) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.acitve = this.acitve;
    }
}