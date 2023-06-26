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

export default function User() {
    const [user, setUser] = useState<user>({})
    const [loading, setLoading] = useState(true)

    function fetchUser() {
        fetch('/api/users/me')
            .then((res) => res.json())
            .then((data) => {
                setUser(data)
                setLoading(false)
            })
    }

    useEffect(fetchUser, [])

    if (loading) {
        return (
            <Layout>
                <h2 className="ml-5 mt-5 text-2xl">Loading...</h2>
            </Layout>
        )
    }

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

            <div>
                {user.role === 'seller' || 'admin' ? (
                    <div>
                        <Link
                            className="ml-4 mt-2 px-4 py-3 block w-32 shadow-lg"
                            href="/users/me/goods"
                        >
                            My products
                        </Link>
                    </div>
                ) : null}
            </div>
            <Link
                className="ml-4 mt-2 px-4 py-3 block w-32 shadow-lg"
                href="/users/me/orders"
            >
                My orders
            </Link>
        </Layout>
    )
}

const router = createRouter()
    // .use(session)
    // .use(middlewares.asyncPassportInit)
    // .use(middlewares.asyncPassportSession)
    .get(async (req, res) => {
        return await container.resolve('UserController').getUserByReq(req)
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
