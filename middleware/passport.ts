import passport from 'passport';
import LocalStrategy from 'passport-local';
import container from '@/server/container';
import { NextApiRequest } from 'next';


passport.serializeUser((user, callback) => {
    console.log('passport serialize, userid=', user.id);
    callback(null, user.id);
});


passport.deserializeUser((req:NextApiRequest, id:number, done) => {
    console.log('passport deserialize, userid', id);
    const user = container.resolve("UserService").findUserById(id).then(user => {done(null, user)})
    .catch(e => done(e, null));
});


passport.use(
    new LocalStrategy({usernameField: 'email', passReqToCallback: true,},
        (req, email, password, done) => {
            // console.log("request to resolve user");
            
            container.resolve("UserService").findUserByEmail(email).then((user) => {
                // console.log("[passport] User found: ", user.username)
                container.resolve("UserService").validatePassword(user, password).then((isValid)=> {
                if (user && isValid) {
                    // console.log("[passport] User password is valid")
                    done(null, user);
                } else {
                    done(true, false, { message: 'Email or password is incorrect' });
                }
            }
            );
        
    }).catch((err) => done(err));
}));



// export const passportAuth = passport.authenticate('local');
export default passport;