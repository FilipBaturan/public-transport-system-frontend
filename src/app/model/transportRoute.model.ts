import { TransportLine } from "src/app/model/transport-line.model";
import { TransportLinePosition } from "./position.model";
import { Schedule } from "./schedule.model";

export class TransportRoute extends TransportLine {
    
    visible: boolean;

    constructor(id: number, name: string, positions: TransportLinePosition[], schedule: Schedule[],
        active: boolean, type: string, zone: number, color: string, width: string, visible: boolean){
            super(id, name, positions, schedule, active, type, zone, color, width);
            this.visible = visible;
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
