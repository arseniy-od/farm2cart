import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

import session from "@/middleware/session";
import passport from "@/middleware/passport";
import container from "@/server/container";


export const router = createRouter<NextApiRequest, NextApiResponse>()


router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .get(async (req: NextApiRequest, res: NextApiResponse) => {
        const reviews = await container.resolve("ReviewService").getReviews();
        res.json(reviews);
    })
    .post(async (req, res) => {
        const reviewData = { ...req.body, authorId: req.user.id, score: parseInt(req.body.score) }
        console.log("[api/reviews] reviewData: ", reviewData)
        const review = await container.resolve("ReviewService").createReview(reviewData);
        res.json(review);
    });


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});
