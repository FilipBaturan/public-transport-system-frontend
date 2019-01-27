import { User } from './users/user.model';

export interface Authentication {

    user: User;
    token: string;

}
