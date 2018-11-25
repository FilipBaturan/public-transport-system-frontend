import { TransportLine } from "src/app/model/transport-line.model";
import { Station } from "src/app/model/station.model";
import { Coordinates } from "./coordinates.model";

export class TransportRoute extends TransportLine {
    
    color: string;
    visible: boolean;
    positions: Coordinates[];
    width: string;

    constructor(id: number, name: string, stations: Station[], schedule: number[],
        active: boolean, type: string,zone: number, color: string, visible: boolean,
        positions: Coordinates[], width: string){
            super(id, name, stations, schedule, active, type,zone);
            this.color = color;
            this.visible = visible;
            this.positions = positions;
            this.width = width;
        }

    toBBCode(): string { 
        let result: string = "";
        this.positions.forEach(position => {
            result += position.latitude + "," + position.longitude + " ";
        });
        if (this.width == "") {
            return result += "(" + this.color + "|" + this.name + ")";
        }else{
            return result += "(" + this.color + "," + this.width + "|" + this.name + ")"
        }
    }
}
