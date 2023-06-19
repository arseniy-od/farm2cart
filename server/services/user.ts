// import { User } from '@/server/database/models'
import { user } from '@/app/interfaces';
import BaseContext from '../baseContext';
import { IUserModel } from '../database/models/user';
const bcrypt = require('bcrypt');

// export default class UserService extends BaseContext

export default class UserService extends BaseContext {

    private User = this.di.User;
    private Company = this.di.Company;

    async getUsers() {
        
        return await this.User.findAll({
                attributes: { exclude: ['password'] },
                include: {
                    model: this.Company,
                    as: 'company'
                },
            }
        );
    }

    async hashPassword(password:string):Promise<string> {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async createUser(userData: user) {
        const emailData = userData.email;
        const passwordHash = await this.hashPassword(userData.password)
        console.log("Hashed password is: ", passwordHash)
        userData.password = passwordHash
        const userEmail = await this.User.findOne({ where: { email: emailData } });
        console.log(userEmail)
        if (userEmail) {
            return { error: "This email is already registered" }
        } else {
            return (
                this.User.create(userData)
            );
        }
    }

    async deleteUser(id: string|number) {
        return await this.User.destroy({ where: { id } });
    }


    async findUserById(id: string|number) {
        const user = await this.User.findOne({ where: { id } })
        if (user) { return user; }
        return { error: true, message: "User not found" }
    }

    async findUserByEmail(email: string) {
        return await this.User.findOne({ where: { email: email } });
    }

    async validatePassword(user: IUserModel, inputPassword: string) {
        const res = await bcrypt.compare(inputPassword, user.password)
        console.log("Password comparison result: ", res) // return true
        return res
    }
    
    async getAllUserIds() {
        const users = await this.User.findAll()
        return users.map(user => {
            return {
                params: {
                    id: user.id.toString()
                }
            }
        })
    }
}

