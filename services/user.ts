import { User } from '@/database/models'
const bcrypt = require('bcrypt');


async function hashPassword(password:string):Promise<string> {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt);
    return hash;
}


export async function getUsers() {
    return await User.findAll(
        {
            attributes: {
                exclude: ['password'] 
            }
        }
    );
}


export async function createUser(userData) {
    const emailData = userData.email;
    const passwordHash = await hashPassword(userData.password)
    console.log("Hashed password is: ", passwordHash)
    userData.password = passwordHash
    const userEmail = await User.findOne({ where: { email: emailData } });
    console.log(userEmail)
    if (userEmail) {
        return { error: "This email is already registered" }
    } else {
        return (
            User.create(userData)
        );
    }
}


export async function deleteUser(id) {
    return await User.destroy({ where: { id } });
}


export async function findUserById(id) {
    const user = await User.findOne({ where: { id } })
    if (user) { return user; }
    return { error: true, message: "User not found" }
}


export async function getUserByEmailAndPassword(id, email) {
    const user = await User.findOne({ where: { email: email, password: password } })
    if (user) { return user; }
    return { error: true, message: "User not found" }
}

export async function findUserByEmail(email) {
    return await User.findOne({ where: { email: email } });
}

export async function validatePassword(user, inputPassword: string) {
    const res = await bcrypt.compare(inputPassword, user.password)
    console.log("Password comparison result: ", res) // return true
    return res
}

export async function getUser(id) {
    const user = await User.findOne({ where: { id: id } })
    if (user) { return user; }
    return { error: true, message: "User not found" }
}


export async function getAllUserIds() {
    const users = await User.findAll()
    return users.map(user => {
        return {
            params: {
                id: user.id.toString()
            }
        }
    })
}