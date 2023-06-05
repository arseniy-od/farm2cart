import {User} from '@/database/models'


export function getUsers() {
    return (User.findAll(
        {
            attributes: ['firstName', 'lastName', 'username', 'email']
        }
    ));
}


export function createUser(userData) {
    return (
        User.create(userData)
        // check email unique
    );
}
