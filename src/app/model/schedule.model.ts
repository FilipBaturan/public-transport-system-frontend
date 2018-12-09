import { TransportLine } from "./transport-line.model";
import { DayOfWeek } from "./enums/day-of-week.model";

export class Schedule {

    id: number;
    departures: string[];
    transportLine: TransportLine;
    dayOfWeek: DayOfWeek;
    active: boolean;
    
}