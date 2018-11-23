import { TransportLine } from "src/app/model/transport-line.model";
import { Station } from "src/app/model/station.model";

export class TransportRoute extends TransportLine {
    color: string;
    visible: boolean;

    constructor(id: number, name: string, stations: Station[], schedule: number[],
        active: boolean, type: string,zone: number, color: string, visible: boolean){
            super(id, name, stations, schedule, active, type,zone);
            this.color = color;
            this.visible = visible;
        }

    toBBCode(): string { 
        let result: string = "";
        for (let index = 0; index < this.stations.length; index++) {
            const station = this.stations[index];
            result += station.coordinates.latitude + "," + station.coordinates.longitude + " "; 
        }
        result += "(" + this.color + "|" + this.name + ")";
        return result;
    }
}
