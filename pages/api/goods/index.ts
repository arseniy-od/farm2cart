import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import multer from 'multer'
import bodyParser from "body-parser";

import { getGoods, createGood, deleteGood } from '@/services/good'
import session from "@/middleware/session";
import passport from "@/middleware/passport";


const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});// Specify the destination folder for file uploads

const uploadMiddleware = upload.single('file');

const router = createRouter<NextApiRequest, NextApiResponse>();

router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .use(uploadMiddleware)
    .get(async (req, res) => {
        const goods = await getGoods();
        res.json(goods);
    })
    .post(async (req, res) => {
        console.log('-----------POST--------------------')
        console.log("Body: ", JSON.stringify(req.body))
        console.log("File: ", req.file)
        const goodData = { ...req.body, seller_id: req.user.id }

        const file = req.file;
        if (file) {
            // Store the file information (e.g., file path) in the `goodData` object
            goodData.imageUrl = file.path;
        }
        console.log("[api/goods] goodData: ", goodData)

        const good = await createGood(goodData);
        res.json(good);
    })
    .delete(async (req, res) => {
        const good = await deleteGood(req.query.id);
        res.json({ res: "Good deleted" });
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
