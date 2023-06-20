import passport from 'passport'
import LocalStrategy from 'passport-local'
import container from '@/server/container'
import { NextApiRequest } from 'next'

passport.serializeUser((user, done) => {
    console.log('passport serialize, userid=', user.id)
    done(null, user.id)
})

passport.deserializeUser((req: NextApiRequest, id: number, done) => {
    console.log('passport deserialize, userid', id)
    const user = container
        .resolve('UserService')
        .getUserById(id)
        .then((user) => {
            done(null, user)
        })
        .catch((e) => done(e, null))
})

passport.use(
    new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        (req: NextApiRequest, email: string, password: string, done) => {
            container
                .resolve('UserService')
                .getUserByEmail(email)
                .then((user) => {
                    if (!user) {
                        done(true, false, { message: 'User not found' })
                        return
                    }
                    container
                        .resolve('UserService')
                        .validatePassword(user, password)
                        .then((isValid) => {
                            if (isValid) {
                                // console.log("[passport] User password is valid")
                                done(null, user)
                            } else {
                                done(true, false, {
                                    message: 'Password is incorrect',
                                })
                            }
                        })
                })
                .catch((err) => done(err))
        }
    )
)

// export const passportAuth = passport.authenticate('local');
export default passport
