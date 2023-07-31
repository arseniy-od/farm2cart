import { ConnectedProps, connect } from 'react-redux'
import { useEffect, useState } from 'react'

import { RootState } from '@/redux/store'
import { fetchOrders, fetchPaginatedOrders } from '@/redux/actions'
import { isEmpty } from '@/app/utils'

import Layout from '@/app/layout'
import OrderCard from '@/app/components/orders/orderCard'
import ErrorMessage from '@/app/components/utils/errorMessage'
import { order } from '@/app/types/entities'
import Paginator from '@/app/components/navigation/paginator'
import { ORDERS_TABLE } from '@/app/constants'
import { useAppDispatch } from '@/redux/hooks'
import Spinner from '@/app/components/utils/spinner'

function MyOrders({
    user,
    orders,
    goods,
    orderGoods,
    fetchOrders,
    pagination,
}: Props) {
    const dispatch = useAppDispatch()

    const handleSearch = (e) => {
        e.preventDefault()
        const query = e.target.search.value
        dispatch(fetchPaginatedOrders(ORDERS_TABLE, 1, query))
    }
    if (user.blank) {
        return (
            <Layout>
                <ErrorMessage message="You are not logged in" />
            </Layout>
        )
    }

    return (
        <Layout handleSearch={handleSearch}>
            {pagination?.fetching && <Spinner />}
            {pagination && !pagination.fetching && pagination.count && (
                <h3 className="ml-6 mt-3 text-xl font-semibold xl:text-center xl:text-2xl">
                    Your orders:
                </h3>
            )}
            {pagination && !pagination.fetching && !pagination.count && (
                <ErrorMessage message="You have no orders yet" />
            )}
            <div>
                <div>
                    <div className="mx-auto flex flex-wrap justify-center">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {orders.map((order, i) => (
                                <div key={i}>
                                    <OrderCard
                                        order={order}
                                        goods={goods}
                                        orderGoods={orderGoods}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Paginator
                        pageName={ORDERS_TABLE}
                        fetchAction={fetchPaginatedOrders}
                        key={ORDERS_TABLE}
                    />
                </div>
            </div>
        </Layout>
    )
}

function getOrdersForUser(state: RootState) {
    if (state.entities.orders) {
        const page = state.pagination[ORDERS_TABLE]
        const orders = Object.values(state.entities.orders)
        if (state.user.id) {
            return orders.filter(
                (order) =>
                    order.id &&
                    page?.pages?.[page?.currentPage || 0].ids.includes(order.id)
            )
        }
    }
    return []
}

const mapState = (state: RootState) => ({
    user: state.user,
    orders: getOrdersForUser(state),
    goods: state.entities.goods,
    orderGoods: state.entities.orderGoods,
    pagination: state.pagination[ORDERS_TABLE],
})

const mapDispatch = {
    fetchOrders,
}

const connector = connect(mapState, mapDispatch)
type Props = ConnectedProps<typeof connector>
export default connector(MyOrders)
