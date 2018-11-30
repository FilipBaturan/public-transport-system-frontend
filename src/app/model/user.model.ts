export class User {

    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    active: boolean;

    constructor(id: number, username: string, password: string, name: string,
        lastName: string, email: string, isActive: boolean){
            this.id = id;
            this.username = username;
            this.password = password;
            this.firstName = name;
            this.lastName = lastName;
            this.email = email;
            this.active = isActive;
        }

}