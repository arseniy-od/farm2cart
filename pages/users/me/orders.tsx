import { createRouter } from 'next-connect'
import Layout from '@/app/layout'
import { useState, useEffect } from 'react'
import Link from 'next/link'

import container from '@/server/container'
import { NextApiRequest, NextApiResponse } from 'next'
import { GoodsProps, UserGoodsOrdersProps, user } from '@/app/types/interfaces'
import OrderCard from '@/app/components/orders/orderCard'

export default function User({ user, goods, orders }: UserGoodsOrdersProps) {
    if (user.error) {
        return (
            <Layout>
                <h2 className="ml-5 mt-5 text-2xl">{user.message}</h2>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="mt-4 ml-4 px-4 py-3 text-lg max-w-xs shadow-lg text-indigo-500">
                @{user.username}
            </div>
            <div>
                {user.role === 'seller' || 'admin' ? (
                    <div>
                        <h3 className="ml-5 mt-3 text-xl">Your orders:</h3>

                        {orders.map((order, i) => (
                            <div key={i}>
                                <div key={i}>
                                    <OrderCard order={order} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </Layout>
    )
}

// const router = createRouter()
//     .use(session)
//     .use(middlewares.asyncPassportInit)
//     .use(middlewares.asyncPassportSession)
//     .get(async (req, res) => {
//         return await container.resolve('UserController').getOrdersForUser(req)
//     })

// export async function getServerSideProps({
//     req,
//     res,
// }: {
//     req: NextApiRequest
//     res: NextApiResponse
// }) {
//     const response = await router.run(req, res)
//     return response
// }
