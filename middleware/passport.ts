import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User } from '@/database/models';
import { findUserById, findUserByEmail, validatePassword } from "@/services/user";
import { NextApiRequest } from 'next';


passport.serializeUser((user, callback) => {
    console.log('passport serialize, userid=', user.id);
    callback(null, user.id);
});


passport.deserializeUser((req:NextApiRequest, id:number, done) => {
    console.log('passport deserialize, userid', id);
    const user = findUserById(id);
    done(null, user)
});


passport.use(
    new LocalStrategy({usernameField: 'email', passReqToCallback: true,},
        (req, email, password, done) => {
        findUserByEmail(email).then((user) => {
        if (user) {
            done(null, user);
        } else {
            done(null, false, { message: 'Email or password is incorrect' });
        }
    }).catch((err) => done(err));
}));



// export const passportAuth = passport.authenticate('local');
export default passport;