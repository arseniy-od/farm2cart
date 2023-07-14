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
// import passport from '@/middleware/passport'

@USE([session, passportInit, passportSession])
export default class CartController extends BaseController {
    private GoodService = this.di.GoodService

    @GET('/api/cart')
    getCart({ session }: NextApiRequestWithUser) {
        const cart = session.cart
        if (cart) {
            return cart
        } else {
            return []
        }
    }

    @POST('/api/cart')
    @USE(validate(cartSchema))
    async addToCart({ body, session }: NextApiRequestWithUser) {
        const goodData = body
        console.log('body', body)
        session.cart = session.cart || []
        let good = await this.GoodService.getGoodById(goodData.goodId)
        good = JSON.parse(JSON.stringify(good))

        // good can be in only one cart item
        await session.cart.push({ id: good.id, quantity: 1, good })
        await session.commit()
        console.log('[POST] Cart: ', session.cart)
        return session.cart
    }

    @DELETE('/api/cart')
    async deleteFromCart({ session, query }: NextApiRequestWithUser) {
        if (typeof query.index === 'string') {
            const good = await session.cart.goods.splice(
                parseInt(query.index),
                1
            )
        }
        if (!session.cart.goods.length) {
            session.cart = null
        }
        await session.commit()
        return { res: `Good #${query.index} deleted` }
    }
}
