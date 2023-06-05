import {User} from '@/database/models'



export function getUsers() {
    return (User.findAll(
        {
            attributes: ['firstName', 'lastName', 'username', 'email']
        }
    ));
}


export async function createUser(userData) {
    const emailData = userData.email;
    const userEmail = await User.findOne({where: {email: emailData}})
    if (userEmail) {
        return {error: "This email is already registered",
        user: userEmail}
    } else {
        return (
            User.create(userData)
        );
    }
}
