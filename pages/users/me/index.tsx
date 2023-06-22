import { createRouter } from 'next-connect'
import Layout from '@/app/layout'
import { useState, useEffect } from 'react'
import session, { middlewares } from '@/middleware/session'
import Link from 'next/link'

import { isConstructorDeclaration } from 'typescript'
import GoodCard from '@/app/components/goodCard'
import container from '@/server/container'
import { NextApiRequest, NextApiResponse } from 'next'
import { GoodsProps, UserGoodsOrdersProps, user } from '@/app/interfaces'
import OrderCard from '@/app/components/orderCard'
import { formatDate, toTitle } from '@/app/utils'

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
            <div className="mt-4 ml-4 px-4 py-3 text-lg max-w-xs bg-gray-100 shadow-lg">
                <div className="text-indigo-500">@{user.username}</div>
                <p>
                    {toTitle(user.firstName)} {toTitle(user.lastName)}
                </p>
                <p>{user.email}</p>
                <p>phone: {user.phoneNumber}</p>
                <p>Registration date: {formatDate(user.registrationDate)}</p>
            </div>

            <div>{user.role === 'seller' || 'admin' ? <div></div> : null}</div>
        </Layout>
    )
}

const router = createRouter()
    .use(session)
    .use(middlewares[0])
    .use(middlewares[1])
    .get(async (req, res) => {
        return await container
            .resolve('UserController')
            .getGoodsAndOrdersForUser(req)
    })

export async function getServerSideProps({
    req,
    res,
}: {
    req: NextApiRequest
    res: NextApiResponse
}) {
    const response = await router.run(req, res)
    return response
}