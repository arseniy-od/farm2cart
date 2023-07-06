import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next'
import Link from 'next/link'

import Layout from '@/app/layout'
import container from '@/server/container'
import { OrdersProps } from '@/app/types/interfaces'
import { ConnectedProps, connect } from 'react-redux'
import { RootState } from '@/redux/store'
import { fetchOrders } from '@/redux/actions'
import { useEffect } from 'react'
import OrderCard from '@/app/components/orders/orderCard'

function MyOrders({ user, orders, fetchOrders }: Props) {
    function getOrders() {
        if (Object.keys(orders).length === 0) {
            fetchOrders()
        }
    }

    useEffect(getOrders, [fetchOrders, orders])

    console.log('Orders: ', orders)
    if (orders.length === 0) {
        return (
            <Layout>
                <h3>You have no orders</h3>
            </Layout>
        )
    }
    return (
        <Layout>
            <div className="mt-4 ml-4 px-4 py-3 text-lg max-w-xs shadow-lg bg-gray-100 text-indigo-500">
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

const mapState = (state: RootState) => ({
    user: state.user,
    orders: state.orders,
})

const mapDispatch = {
    fetchOrders,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector>
export default connector(MyOrders)
