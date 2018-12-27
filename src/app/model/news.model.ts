export class News{
    id: number;
    title: string;
    content: string;
    active: boolean;
    operator: number;
    date: Date;

    constructor(id: number, title: string, content: string, active: boolean, operator: number, date: Date){
        this.id = id;
        this.title = title;
        this.content = content;
        this.active = active;
        this.operator = operator;
        this.date = date;
    }
}