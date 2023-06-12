import {createRouter} from 'next-connect';
import multer from 'multer';


import { getGoods, createGood, deleteGood } from '@/services/good'
import session from "@/middleware/session";
import passport from "@/middleware/passport";

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const router = createRouter()

// apiRoute.use(upload.array('theFiles'));

router
    .use(session)
    .use(passport.initialize())
    .use(passport.session())
    .use(upload.single('theFiles'))
    .post((req, res) => {
        console.log("\n\nUPLOAD:\n", req.file)
        res.status(200).json({ data: 'success' });
    });


export default router.handler({
    onError: (err, req, res) => {
        console.error(err.stack);
        res.status(err.statusCode || 500).end(err.message);
    },
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
