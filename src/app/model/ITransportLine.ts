import { IStation } from "./IStation";

export interface ITransportLine {
    id: number,
    name: string,
    statsions: IStation[],
    schedule: number[],
    active: boolean,
    type : string,
    zone: number
}