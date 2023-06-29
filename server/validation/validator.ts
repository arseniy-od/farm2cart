import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import addFormats from 'ajv-formats'

export default function validate(schema: { [key: string]: any }) {
    const ajv = new Ajv({ allErrors: true })
    ajvErrors(ajv)
    addFormats(ajv)
    const validate = ajv.compile(schema)
    return async (req, res, next) => {
        const valid = validate(req.body)
        if (valid) {
            return await next()
        } else {
            const error = validate.errors[0]
            console.error('ERROR in Validator', error)
            return res.status(400).json({
                error: true,
                message: error.message,
            })
        }
    }
}
