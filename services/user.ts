import {User} from '@/database/models'
const bcrypt = require('bcrypt');


async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}


export async function getUsers() {
    return await User.findAll(
        {
            attributes: ['firstName', 'lastName', 'username', 'email', 'password']
        }
    );
}


export async function createUser(userData) {
    const emailData = userData.email;
    const passwordHash = await hashPassword(userData.password)
    console.log("Hashed password is: ",passwordHash)
    userData.password = passwordHash
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

export async function findUserByEmail(req, email) {
        return await User.findOne({where: {email: email}});
    }

export function validatePassword(user, inputPassword:string) {
    console.log("Input password: ", inputPassword)
        return hashPassword(inputPassword) === user.password
}

export async function getUser(id) {
    const user = await User.findOne({where: {id: id}})
    if (user) {return user;}
    return {error: true, message: "User not found"}
}
