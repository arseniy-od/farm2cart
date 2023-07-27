import { CODES } from '@/app/constants'
import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import addFormats from 'ajv-formats'
import _ from 'lodash'

export default function validate(schema: { [key: string]: any }) {
    const ajv = new Ajv({ allErrors: true })
    ajvErrors(ajv)
    addFormats(ajv)
    const validate = ajv.compile(schema)
    return async (req, res, next) => {
        const content = _.merge(req.body, req.query, req.params)
        console.log('Content:', content)
        const valid = validate(content)
        if (valid) {
            return await next()
        } else {
            const error = validate?.errors?.[0]
            console.error('ERROR in Validator', error)
            return res.status(400).json({
                data: [],
                message: error?.message,
                code: CODES.TOAST,
            })
        }
    }
}
