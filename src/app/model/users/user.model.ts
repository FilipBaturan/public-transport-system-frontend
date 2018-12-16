export class User {

    id: number;
    username: string;
    password: string;
    name: string;
    lastName: string;
    email: string;
    active: boolean;
    telephone: string;

    constructor(id: number, username: string, password: string, name: string,
        lastName: string, email: string, isActive: boolean, phoneNumber: string){
            this.id = id;
            this.username = username;
            this.password = password;
            this.name = name;
            this.lastName = lastName;
            this.email = email;
            this.active = isActive;
            this.telephone = phoneNumber;
        }


}