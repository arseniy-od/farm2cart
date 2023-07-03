import multer from 'multer'

function createUniqueName(filename: string) {
    const [name, ext] = filename.split('.')
    return `${name}-${Date.now()}.${ext}`
}

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) =>
            cb(null, createUniqueName(file.originalname)),
    }),
})

const uploadMiddleware = upload.single('file')

export default uploadMiddleware
