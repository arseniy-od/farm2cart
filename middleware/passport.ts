import passport from 'passport'
import LocalStrategy from 'passport-local'
import container from '@/server/container'
// import UserService from '@/server/services/user'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import { NextApiRequestWithUser } from '@/app/types/interfaces'

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
        .catch((e) => {
            console.log('error deserialize', e)
            done(e, null)
        })
})

passport.use(
    new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        (req: NextApiRequest, email: string, password: string, done) => {
            container
                .resolve('UserService')
                .getUserByEmail(email)
                .then((user) => {
                    if (user.error || !user) {
                        done(true, false, {
                            message: user?.message || 'User not found',
                        })
                        return
                    }
                    container
                        .resolve('UserService')
                        .validatePassword(user, password)
                        .then((isValid) => {
                            if (isValid) {
                                console.log('[passport] User password is valid')
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
            console.error('[passport.ts] User not found')
            return res
                .status(500)
                .json({ error: true, message: 'User not found' })
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log('\nDev: LogIn Error: \n', err)
                // req.session.user = JSON.parse(JSON.stringify(user))category image
                return next()
            }
            return res.json({ user })
        })

        req.session.user = req.user
        req.session.commit()
        console.log('\n\n[passportAuth] Request User is:\n', req.session.user)
    })(req, res, next)
}

// export const passportInit = passport.initialize()
// export const passportSession = passport.session()
export default passport
