import { NextApiRequest, NextApiResponse } from 'next'
import BaseController from './baseController'

import GET from '../decorators/get'
import POST from '../decorators/post'
import SSR from '../decorators/ssr'
import USE from '../decorators/use'
import DELETE from '../decorators/delete'

import session, { passportInit, passportSession } from '@/middleware/session'
import { NextApiRequestWithUser } from '@/app/types/interfaces'
import validate from '../validation/validator'
import { cartSchema } from '../validation/schemas'
import { goodSchema } from '@/redux/normalSchemas'
import { CODES } from '@/app/constants'

@USE([session, passportInit, passportSession])
export default class CartController extends BaseController {
    private CartService = this.di.CartService

    @GET('/api/cart')
    getCart({ session }: NextApiRequestWithUser) {
        this.createMessage({
            successMessage: 'Cart fetched',
            failMessage: 'Cart not fetched',
            successCode: CODES.DEBUG,
            failCode: CODES.TOAST,
        })
        const cart = session.cart || []
        return cart
    }

    @POST('/api/cart')
    @USE(validate(cartSchema))
    async addToCart({ body, session }: NextApiRequestWithUser) {
        this.createMessage({
            successMessage: 'Good added to cart',
            failMessage: 'Error while adding good',
        })
        const goodData = body
        return this.CartService.addToCart({ goodData, session })
    }

    @DELETE('/api/cart')
    async deleteFromCart({ session, query }: NextApiRequestWithUser) {
        this.createMessage({
            successMessage: 'Good deleted from cart',
            failMessage: 'Error while deleting good',
            successCode: CODES.DEBUG,
            failCode: CODES.TOAST,
        })
        const index = query?.index
        return this.CartService.deleteFromCart({ session, index })
    }
}
