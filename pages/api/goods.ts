import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from 'multer'

import session from "@/middleware/session";
import passport from "@/middleware/passport";
import container from "@/server/container";


const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});

const uploadMiddleware = upload.single('file');

const router = createRouter<NextApiRequest, NextApiResponse>();

export type GoodDataType = {

}


router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .use(uploadMiddleware)
    .get(async (req, res) => {
        const goods = await container.resolve("GoodService").getGoods();
        res.json(goods);
    })
    .post(async (req, res) => {
        const goodData = { ...req.body, seller_id: req.user.id }

        const file = req.file;
        if (file) {
            // Store the file information (e.g., file path) in the `goodData` object
            goodData.imageUrl = file.path.replace('public', '');
        }
        console.log("[api/goods] goodData: ", goodData)

        const good = await container.resolve("GoodService").createGood(goodData);
        console.log("[api/goods] Good: ", good)
        res.json(good);
    })
    .delete(async (req, res) => {
        if (req.query.id) {
            const good = await container.resolve("GoodService").deleteGood(req.query.id);
            res.json({ res: "Good deleted" });
        } else {
            res.json({error: true, message: "id not found"})
        }
        
    });



export const config = {
    api: {
        bodyParser: false
        // {sizeLimit: '4mb'}
    }
}


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});
