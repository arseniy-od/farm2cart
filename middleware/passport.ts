import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User } from '@/database/models';
import { findUserByEmail, validatePassword } from "@/services/user";


passport.serializeUser((user, callback) => {
    console.log('passport serialize, userId=', user.id);
    callback(null, user.id);
});


passport.deserializeUser((req, id, done) => {
    console.log('passport deserialize, userId', id);
    const user = findUserByEmail(req, id);
    done(null, user)
});


passport.use(
    new LocalStrategy({usernameField: 'email', passReqToCallback: true,},
        (req, email, password, done) => {
        findUserByEmail(req, email).then((user) => {
        if (user) {
            done(null, user);
        } else {
            done(null, false, { message: 'Email or password is incorrect' });
        }
    }).catch((err) => done(err));
}));



// export const passportAuth = passport.authenticate('local');
export default passport;