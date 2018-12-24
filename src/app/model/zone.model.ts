import { ZoneTransportLine } from "./users/zone-transport-line.model";

export class Zone{

    id: number;
    name: string;
    active: boolean;
    lines: ZoneTransportLine[];

}