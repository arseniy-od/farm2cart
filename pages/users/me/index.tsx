import { createRouter } from 'next-connect'
import Layout from '@/app/layout'
import { useState, useEffect } from 'react'
import session, { middlewares } from '@/middleware/session'
import Link from 'next/link'

import { isConstructorDeclaration } from 'typescript'
import GoodCard from '@/app/components/goodCard'
import container from '@/server/container'
import { NextApiRequest, NextApiResponse } from 'next'
import { GoodsProps, UserGoodsOrdersProps, user } from '@/app/types/interfaces'
import OrderCard from '@/app/components/orderCard'
import { formatDate, toTitle } from '@/app/utils'
import { useAppSelector } from '@/redux/hooks'

export default function User() {
    const user = useAppSelector((state) => state.user)

    if (Object.keys(user).length === 0) {
        return (
            <Layout>
                <h2 className="ml-5 mt-5 text-2xl">You are not logged in</h2>
            </Layout>
        )
    }

    if (user.error || user.message) {
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
