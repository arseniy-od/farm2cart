import { createRouter } from 'next-connect'
import Layout from '@/app/layout'
import { useState, useEffect } from 'react'
import Link from 'next/link'

import { isConstructorDeclaration } from 'typescript'
import GoodCard from '@/app/components/goods/goodCard'
import container from '@/server/container'
import { NextApiRequest, NextApiResponse } from 'next'
import { GoodsProps, UserGoodsOrdersProps, user } from '@/app/types/interfaces'
import { RootState } from '@/redux/store'
import { ConnectedProps, connect } from 'react-redux'
import { fetchMyGoods } from '@/redux/actions'
// import OrderCard from '@/app/components/orderCard'

function MyGoods({ user, goods, fetchMyGoods }: Props) {
    const MyGoods = goods.filter((good) => good.seller.id === user.id)

    function getGoods() {
        fetchMyGoods(user.id)
    }

    useEffect(getGoods, [fetchMyGoods, user])

    if (user.error) {
        return (
            <Layout>
                <h2 className="ml-5 mt-5 text-2xl">{user.message}</h2>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="mt-4 ml-4 px-4 py-3 text-lg border-2 max-w-xs text-center bg-gray-200 rounded-lg">
                Username:{' '}
                <span className="text-indigo-500">@{user.username}</span>
            </div>
            <div>
                {user.role === 'seller' || 'admin' ? (
                    <div>
                        <h3 className="ml-5 mt-3 text-xl">Your products:</h3>
                        {MyGoods.map((good, i) => (
                            <div key={i}>
                                <div>
                                    <GoodCard good={good} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </Layout>
    )
}

const mapState = (state: RootState) => ({
    user: state.user,
    goods: state.goods,
})

const mapDispatch = {
    fetchMyGoods,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector>
export default connector(MyGoods)
