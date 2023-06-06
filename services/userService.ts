import {User} from '@/database/models'

class UserService {
    async getUserById(userId) {
        const user = await User.findById(userId);
        return user;
    }

    async findUserForAuth(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async createUser(userData) {
        const user = new User(userData);
        await user.save();
        return user;
    }

    async updateUser(userId, userData) {
        const user = await User.findByIdAndUpdate(userId, userData, { new: true });
        return user;
    }

    async deleteUser(userId) {
        await User.findByIdAndDelete(userId);
    }

    async findUserByEmail(email) {
        const user = await User.findOne({ email });
        return user;
    }

    async findUserWithEmailAndPassword(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            return null;
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return null;
        }
        return user;
    }
}

module.exports = UserService;