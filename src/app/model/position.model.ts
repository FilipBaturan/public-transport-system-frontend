export abstract class Position{
    
    id: number;
    latitude: number;
    longitude: number;

    constructor(id: number, latitude: number, longitude: number){
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

export class StationPosition extends Position {
    constructor(id: number, latitude: number, longitude: number){
        super(id, latitude, longitude);
    }
}

export class TransportLinePosition extends Position {

    constructor(id: number, latitude: number, longitude: number){
        super(id, latitude, longitude);
    }
}