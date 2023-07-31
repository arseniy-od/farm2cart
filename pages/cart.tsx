import { useEffect, MouseEvent } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { getTotal, isEmpty } from '@/app/utils'
import {
    clearCart,
    createOrder,
    deleteCartItem,
    fetchCartItems,
} from '@/redux/actions'

import CartGood from '@/app/components/cart/cartGood'
import Layout from '@/app/layout'

import { RootState } from '@/redux/store'
import Spinner from '@/app/components/utils/spinner'

function Cart({
    cartItems,
    goods,
    fetchCartItems,
    deleteCartItem,
    createOrder,
    clearCart,
}: PropsFromRedux) {
    useEffect(() => {
        if (!cartItems) {
            fetchCartItems()
        }
    }, [fetchCartItems, cartItems])

    const handleDelete = async (index: number) => {
        deleteCartItem(index)
    }

    async function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (!cartItems) {
            throw new Error('cartItems not found')
        }
        const cartGoods = Object.values(goods || {}).reduce(
            (acc: any, good) => {
                if (good.id && good.id in cartItems) {
                    acc.push({ ...good, quantity: cartItems[good.id].quantity })
                }
                return acc
            },
            []
        )
        const cartData = { goods: cartGoods, total: getTotal(cartGoods) }
        clearCart()
        createOrder(cartData)
    }

    if (!cartItems) {
        return (
            <Layout>
                <Spinner />
            </Layout>
        )
    }
    if (isEmpty(cartItems)) {
        return (
            <Layout>
                <h1 className="mt-6 text-center text-2xl">Cart is empty</h1>
            </Layout>
        )
    }
    return (
        <Layout>
            <div>
                <h1 className="ml-4 mt-4 text-2xl">Cart</h1>
                <div>
                    <form>
                        {Object.values(cartItems).map((cartItem, i) => (
                            <div key={i}>
                                <CartGood
                                    cartItem={cartItem}
                                    good={goods?.[cartItem?.good || '']}
                                    index={i}
                                    handleDelete={handleDelete}
                                />
                            </div>
                        ))}
                        <button
                            className="btn-submit ml-4"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

const mapState = (state: RootState) => ({
    cartItems: state.entities.cartItems,
    goods: state.entities.goods,
})

const mapDispatch = {
    fetchCartItems,
    deleteCartItem,
    createOrder,
    clearCart,
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(Cart)
