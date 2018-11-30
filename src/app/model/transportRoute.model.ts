import { TransportLine } from "src/app/model/transportLine.model";
import { TransportLinePosition } from "./position.model";
import { Schedule } from "./schedule.model";

export class TransportRoute extends TransportLine {
    
    visible: boolean;

    constructor(id: number, name: string, positions: TransportLinePosition, schedule: Schedule[],
        active: boolean, type: string, zone: number, visible: boolean){
            super(id, name, positions, schedule, active, type, zone);
            this.visible = visible;
        }
}

export class TransportLineCollection {

    transportLines: TransportLine[];

    constructor(transportLines: TransportLine[]) {
        this.transportLines = transportLines;
    }
}
