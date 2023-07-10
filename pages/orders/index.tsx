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
import { isEmpty } from '@/app/utils'

function MyOrders({ user, orders, goods, orderGoods, fetchOrders }: Props) {
    useEffect(() => {
        fetchOrders()
    }, [])

    console.log('Orders: ', orders)

    if (!orders || isEmpty(orders)) {
        return (
            <Layout>
                <h3>{orders ? 'You have no orders' : 'Loading...'}</h3>
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

                        {Object.values(orders).map((order, i) => (
                            <div key={i}>
                                <div key={i}>
                                    <OrderCard
                                        order={order}
                                        goods={goods}
                                        orderGoods={orderGoods}
                                    />
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
    orders: state.entities.orders,
    goods: state.entities.goods,
    orderGoods: state.entities.orderGoods,
})

const mapDispatch = {
    fetchOrders,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector>
export default connector(MyOrders)
