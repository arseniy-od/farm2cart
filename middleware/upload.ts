import multer from 'multer'

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
})

const uploadMiddleware = upload.single('file')

export default uploadMiddleware
