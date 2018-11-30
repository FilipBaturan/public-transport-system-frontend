export abstract class Position{
    
    id: number;
    latitude: number;
    longitude: number;
    active: boolean

    constructor(id: number, latitude: number, longitude: number, active: boolean){
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.active = active;
    }
}

export class StationPosition extends Position {
    constructor(id: number, latitude: number, longitude: number, active: boolean){
        super(id, latitude, longitude, active);
    }
}

export class TransportLinePosition {

    id: number;
    content: string;
    active: boolean;

    constructor(id: number, content: string, active: boolean){
        this.id = id;
        this.content = content;
        this.active = active;
    }
}