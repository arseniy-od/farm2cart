import BaseContext from '../baseContext'

export default class CartService extends BaseContext {
    private Good = this.di.Good
    private User = this.di.User
    private Category = this.di.Category
    private GoodService = this.di.GoodService

    async addToCart({ goodData, session }) {
        session.cart = session.cart || []
        let good = await this.GoodService.getGoodById(goodData.goodId)

        if (!good) {
            return {
                error: true,
                message: `Good with id ${goodData.goodId} not found`,
            }
        }

        const parsedGood = good.toJSON()

        if (parsedGood.error) {
            return { error: true, message: parsedGood.message }
        }
        // good can be in only one cart item
        await session.cart.push({
            id: parsedGood.id,
            quantity: 1,
            good: parsedGood,
        })
        await session.commit()
        console.log('[POST] Cart: ', session.cart)
        return session.cart
    }

    async deleteFromCart({ session, index }) {
        if (typeof index === 'string') {
            const good = await session.cart.splice(parseInt(index), 1)[0]
            if (!session.cart.length) {
                session.cart = null
            }
            await session.commit()
            return { res: 'Ok', goodId: good.id }
        } else {
            return {
                error: true,
                message:
                    'index format is not supported. Use /api/cart?index=<int>',
            }
        }
    }
}
