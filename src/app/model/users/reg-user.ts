export class regUser {

    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;

    constructor(id: number, username: string, name: string, lastName: string, email: string){
        this.id = id;
        this.username = username;
        this.firstName = name;
        this.lastName = lastName;
        this.email = email;
    }

}