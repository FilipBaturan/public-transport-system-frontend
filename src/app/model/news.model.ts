export interface News {
    id: number;
    title: string;
    content: string;
    active: boolean;
    operator: number;
    date: Date;

}

export interface NewsToAdd {
    title: string;
    content: string;
    operator: number;

}
