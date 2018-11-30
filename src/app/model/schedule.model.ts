import { Days } from "./enums/days.enum";

export class Schedule {

    id: number;
    startTime: string;
    transportRoute: number;
    day: Days;

    constructor(id: number, startTime: string, transportRoute: number, day: Days){
        this.id = id;
        this.startTime = startTime;
        this.transportRoute = transportRoute;
        this.day = day;
    }
}