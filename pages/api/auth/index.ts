import {router} from '@/middleware/router'
import passport from "@/middleware/passport";


router
    .post(passport.authenticate('local'), (req, res) => {
        console.log("Request User is: ", req.user)
        res.json({ user: req.user })
    })


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});