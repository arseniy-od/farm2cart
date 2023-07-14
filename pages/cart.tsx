import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, MouseEvent } from 'react'
import axios from 'axios'

import { NextApiRequest, NextApiResponse } from 'next'
import { good } from '@/app/types/interfaces'
import { useAppDispatch } from '@/redux/hooks'
import CartMain from '@/app/components/cart/cartMain'
import { apiDelete, getTotal, isEmpty } from '@/app/utils'
import {
    createOrder,
    decrementQuantity,
    deleteCartItem,
    fetchCartItems,
    updateEntities,
} from '@/redux/actions'
import { normalize } from 'normalizr'
import { orderSchema } from '@/redux/normalSchemas'
import { RootState } from '@/redux/store'
import { ConnectedProps, connect } from 'react-redux'
import CartGood from '@/app/components/cart/cartGood'
import Layout from '@/app/layout'

type cart = (good & { quantity: number })[]

function Cart({
    cartItems,
    goods,
    fetchCartItems,
    deleteCartItem,
    createOrder,
}: PropsFromRedux) {
    const [cartGoods, setCartGoods] = useState<(good & { quantity: number })[]>(
        []
    )
    // const dispatch = useAppDispatch()

    // function fetchCart() {
    //     fetch('/api/cart')
    //         .then((res) => res.json())
    //         .then((cart: cart) => setCartGoods(cart))
    // }

    useEffect(() => {
        fetchCartItems()
    }, [fetchCartItems])

    const handleDelete = async (index: number, id: number) => {
        deleteCartItem(index) //! implement
        // const res = await apiDelete(`/api/cart?index=${index}`)
        // if (!res.error) {
        //     setCartGoods(
        //         cartGoods.filter((cartGood: good) => cartGood.id !== id)
        //     )
        // }
    }

    async function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        const cartData = { goods: cartGoods, total: getTotal(cartGoods) }
        //! check is everything ok
        createOrder(cartData)
    }

    if (!cartItems) {
        return (
            <Layout>
                <h1 className="mt-6 text-center text-2xl">Loading...</h1>
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
                                    good={goods[cartItem.good]}
                                    index={i}
                                    cartItems={cartItems}
                                    setCartGoods={setCartGoods}
                                    handleDelete={handleDelete}
                                />
                            </div>
                        ))}
                        <button
                            className="mt-4 ml-4 px-6 py-3 inline-block shadow-lg hover:bg-gray-200"
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
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
export default connector(Cart)
