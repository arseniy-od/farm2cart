import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, MouseEvent } from 'react'
import axios from 'axios'

import { NextApiRequest, NextApiResponse } from 'next'
import { good } from '@/app/types/interfaces'
import { useAppDispatch } from '@/redux/hooks'
import CartMain from '@/app/components/cart/cartMain'
import { apiDelete, getTotal } from '@/app/utils'
import { createOrder, decrementQuantity, updateEntities } from '@/redux/actions'
import { normalize } from 'normalizr'
import { orderSchema } from '@/redux/normalSchemas'

type cart = {
    blank?: boolean
    goods: (good & { quantity: number })[]
}

export default function Cart() {
    const [cartGoods, setCartGoods] = useState<(good & { quantity: number })[]>(
        []
    )
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
    }

    async function handleSubmit(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        const cartData = { goods: cartGoods, total: getTotal(cartGoods) }
        dispatch(createOrder(cartData))
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
