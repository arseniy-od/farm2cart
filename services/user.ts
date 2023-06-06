import {User} from '@/database/models'



export async function getUsers() {
    return await User.findAll(
        {
            attributes: ['firstName', 'lastName', 'username', 'email']
        }
    );
}


export async function createUser(userData) {
    const emailData = userData.email;
    const userEmail = await User.findOne({where: {email: emailData}});
    if (userEmail) {
        return {error: "This email is already registered"}
    } else {
        return (
            User.create(userData)
        );
    }
}


export async function getUserbyId(id) {
    const user = await User.findOne({where: {id: id}})
    if (user) {return user;}
    return {error: true, message: "User not found"}
}


export async function getUserByEmailAndPassword(id, email) {
    const user = await User.findOne({where: {email: email, password: password}})
    if (user) {return user;}
    return {error: true, message: "User not found"}
}

