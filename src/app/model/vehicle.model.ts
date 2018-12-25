export class Vehicle {
    id: number;
    name: string;
    type: string;
    currentLine: TransportLineIdentifier;

    constructor(id: number, name: string, type: string,
        currentLine: TransportLineIdentifier){
        this.id = id;
        this.name = name;
        this.type = type;
        this.currentLine = currentLine;
    }
}

export class TransportLineIdentifier {
    id: number;
    name: string;

    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
    }
}

export class VehicleSaver {
    id: number;
    name: string;
    type: string;
    currentLine: number;
    active: boolean

    constructor(id: number, name: string, type: string,currentLine: number){
        this.id = id;
        this.name = name;
        this.type = type;
        this.currentLine = currentLine;
        this.active = true;
    }
}