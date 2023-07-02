import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, MouseEvent } from 'react'
import axios from 'axios'

import { NextApiRequest, NextApiResponse } from 'next'
import { good } from '@/app/types/interfaces'
import { useAppDispatch } from '@/redux/hooks'
import CartMain from '@/app/components/cart/cart'
import { apiDelete, getTotal } from '@/app/utils'

type cart = {
    blank?: boolean
    goods: (good & { quantity: number })[]
}

export default function Cart() {
    const [cartGoods, setCartGoods] = useState<(good & { quantity: number })[]>(
        []
    )
    const { push } = useRouter()
    const dispatch = useAppDispatch()
    const config = {
        headers: { 'content-type': 'application/json' },
    }

    function fetchCart() {
        fetch('/api/cart')
            .then((res) => res.json())
            .then((cart: cart) => setCartGoods(cart.goods))
    }

    useEffect(fetchCart, [])

    const handleDelete = async (index: number, id: number) => {
        const res = await apiDelete(`/api/cart?index=${index}`)
        if (!res.error) {
            setCartGoods(
                cartGoods.filter((cartGood: good) => cartGood.id !== id)
            )
        }

        async function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
            event.preventDefault()
            // console.log('Submit')
            const cartData = { goods: cartGoods, total: getTotal(cartGoods) }
            const response = await axios.post('/api/orders', cartData, config)
            console.log('response: ', response)
            if (response.status === 200) {
                cartGoods.forEach((good) =>
                    dispatch({
                        type: 'goods/decrement_quantity',
                        payload: { id: good.id, quantity: good.quantity },
                    })
                )
                //todo dispatch new order
                const orderId = response.data.id
                push('/orders/' + orderId)
            }
        }

        return (
            <CartMain
                goods={cartGoods}
                setCartGoods={setCartGoods}
                handleDelete={handleDelete}
                handleSubmit={handleSubmit}
            />
        )
    }
}

// const router = createRouter()
//     .use(session)
//     .use(middlewares.asyncPassportInit)
//     .use(middlewares.asyncPassportSession)
//     .get(async (req, res) => {
//         // console.log("session: ", req.session);
//         const cart = req.session.cart
//         if (!cart) {
//             return { notFound: true }
//         }
//         return cart
//     })

// export async function getServerSideProps({
//     req,
//     res,
// }: {
//     req: NextApiRequest
//     res: NextApiResponse
// }) {
//     const cart = await router.run(req, res)
//     if (cart.notFound) {
//         return { props: { cart: { notFound: true, goods: [] } } }
//     }
//     let cartGoods = []
//     for (let cartEl of cart) {
//         const good = await container
//             .resolve('GoodService')
//             .getGoodByIdExtended(cartEl.goodId)
//         cartGoods.push({ quantity: 1, ...good })
//     }

//     return { props: { cart: { goods: cartGoods } } }
// }
