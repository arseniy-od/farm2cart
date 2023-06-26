import { createRouter } from 'next-connect'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, MouseEvent } from 'react'
import Link from 'next/link'
import axios from 'axios'

import session, { middlewares } from '@/middleware/session'
import Layout from '@/app/layout'
import CartGood from '@/app/components/cartGood'
import container from '@/server/container'
import { NextApiRequest, NextApiResponse } from 'next'
import { good } from '@/app/interfaces'

type cart = {
    cart: { notFound?: boolean; goods: (good & { quantity: number })[] }
}

export default function Cart({ cart }: cart) {
    const [cartGoods, setCartGoods] = useState([...cart.goods])
    // const [deletedIds, setDeletedIds] = useState(Array<number>)
    const { push } = useRouter()

    const config = {
        headers: { 'content-type': 'application/json' },
    }

    const handleDelete = async (index: number, id: number) => {
        console.log('DELETE')
        try {
            const res = await fetch(`/api/cart?index=${index}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                // query: JSON.stringify(index)
            })
            if (res.ok) {
                const deleted = await res.json()
                setCartGoods(
                    cartGoods.filter((cartGood: good) => cartGood.id !== id)
                )
                // setDeletedIds([...deletedIds, id])
                console.log('Good deleted')
            } else {
                console.log('Good not deleted')
            }
        } catch (e) {
            console.error('ERR: ', e)
        }
    }

    function getTotal(goods: (good & { quantity: number })[]) {
        let total: number = 0
        for (let good of goods) {
            total += good.price * good.quantity
        }
        return total
    }

    async function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        console.log('Submit')

        const cartData = { goods: cartGoods, total: getTotal(cartGoods) }
        const response = await axios.post('/api/orders', cartData, config)
        const orderId = response.data.id
        push('/orders/' + response.data.id)
    }
    if (cart.notFound || cartGoods.length === 0) {
        return (
            <Layout>
                <h1>Cart is empty</h1>
            </Layout>
        )
    }
    return (
        <Layout>
            <div>
                <h1 className="ml-4 mt-4 text-2xl">Cart</h1>
                <div>
                    <form>
                        {cartGoods.map((good, i) => (
                            <div key={i}>
                                <CartGood
                                    good={good}
                                    index={i}
                                    cartGoods={cartGoods}
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

const router = createRouter()
    .use(session)
    .use(middlewares.asyncPassportInit)
    .use(middlewares.asyncPassportSession)
    .get(async (req, res) => {
        // console.log("session: ", req.session);
        const cart = req.session.cart
        if (!cart) {
            return { notFound: true }
        }
        return cart
    })

export async function getServerSideProps({
    req,
    res,
}: {
    req: NextApiRequest
    res: NextApiResponse
}) {
    const cart = await router.run(req, res)
    if (cart.notFound) {
        return { props: { cart: { notFound: true, goods: [] } } }
    }
    let cartGoods = []
    for (let cartEl of cart) {
        const good = await container
            .resolve('GoodService')
            .getGoodById(cartEl.goodId)
        cartGoods.push({ quantity: 1, ...good })
    }

    return { props: { cart: { goods: cartGoods } } }
}
