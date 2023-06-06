import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '@/database/models';
import {UserService} from "@/services/userService";


passport.serializeUser((user, callback) => {
    console.log('passport serialize, userId=', user.id);
    callback(null, user.id);
});


passport.deserializeUser((req, id, done) => {
    console.log('passport deserialize, userId', id);
    User.findByPk(id).then((user) => {
        if (user) {
            done(null, user);
        } else {
            done(null, false, { message: 'User not found' });
        }
    }).catch((err) => done(err));
});


passport.use(
    new LocalStrategy({usernameField: 'email', passReqToCallback: true,},
        (req, email, password, done) => {UserService.findUserWithEmailAndPassword(email, password).then((user) => {
        if (user) {
            done(null, user);
        } else {
            done(null, false, { message: 'Email or password is incorrect' });
        }
    }).catch((err) => done(err));
}));



export const passportAuth = passport.authenticate('local');
export default passport;