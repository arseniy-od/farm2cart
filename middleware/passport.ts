import passport from 'passport'
import LocalStrategy from 'passport-local'
import container from '@/server/container'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import { NextApiRequestWithUser } from '@/app/interfaces'

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

export const passportAuth = (
    req: NextApiRequestWithUser,
    res: NextApiResponse,
    next: NextHandler
) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('\nPassport authenticate error:\n', err)
            return next()
        }
        if (!user) {
            console.error('No user')
            return res
                .status(500)
                .json({ error: true, message: 'User not found' })
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log('\nDev: LogIn Error: \n', err)
                return next()
            }
            return res.json({ user })
        })

        console.log('\n\n[api/auth/index] Request User is:\n', req.user)
    })(req, res, next)
}

export default passport
